using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Moq.Protected;
using System.Net;
using System.Text.Json;
using SimpleIntegrationApi.Mappers;
using SimpleIntegrationApi.Models.Nppes;
using SimpleIntegrationApi.Services;

namespace SimpleIntegrationApi.Controllers;

[TestClass]
public sealed class ProvidersControllerTests
{
    private Mock<ILogger<ProvidersController>> _mockLogger = null!;
    private Mock<HttpMessageHandler> _mockHttpMessageHandler = null!;
    private ProvidersController _controller = null!;

    [TestInitialize]
    public void Setup()
    {
        _mockLogger = new Mock<ILogger<ProvidersController>>();
        _mockHttpMessageHandler = new Mock<HttpMessageHandler>();

        var client = new HttpClient(_mockHttpMessageHandler.Object)
        {
            BaseAddress = new Uri("https://npiregistry.cms.hhs.gov") // Mocked Base URL
        };

        var nppesApiClient = new NppesApiClient(client, Mock.Of<ILogger<NppesApiClient>>());

        _controller = new ProvidersController(
            nppesApiClient,
            _mockLogger.Object
        );
    }
    [TestCleanup]
    public void Cleanup()
    {
        // Explicitly clean up mocks and reset states for isolation
        _mockLogger.Reset();
        _mockHttpMessageHandler.Reset();
        _controller = null!;
        
        // Nullify the controller instance (optional, ensures no dependency leakage)
        _controller = null!;
    }

    [TestMethod]
    public async Task Get_WithAllParameters_ReturnsOkResult()
    {
        // Arrange
        var nppesResponse = new NppesResponse
        {
            results = new List<NPPESResult>
            {
                new()
                {
                    number = "1234567890",
                    basic = new Basic { first_name = "John", last_name = "Doe" },
                    addresses = new List<Address>
                    {
                        new() { address_1 = "123 Main St", city = "Seattle", state = "WA", postal_code = "98101" }
                    }
                }
            },
            result_count = 1
        };

        SetupMockHttpResponse(HttpStatusCode.OK, nppesResponse);

        // Act
        var result = await _controller.Get("John", "Doe", "Seattle", "WA");

        // Assert
        Assert.IsInstanceOfType(result, typeof(OkObjectResult));
        var okResult = (OkObjectResult)result;
        Assert.IsNotNull(okResult.Value);
        var providers = (List<ProviderResponse>)okResult.Value;
        Assert.AreEqual(1, providers.Count);
        Assert.AreEqual("Doe, John", providers[0].name);
        Assert.AreEqual("1234567890", providers[0].npi);
        Assert.AreEqual("Seattle", providers[0].city);
    }

    [TestMethod]
    public async Task Get_WithNoParameters_ReturnsEmptyList()
    {
        // Act
        var result = await _controller.Get(null, null, null, null);

        // Assert
        Assert.IsInstanceOfType(result, typeof(OkObjectResult));
        var okResult = (OkObjectResult)result;
        var providers = (List<object>)okResult.Value;
        Assert.AreEqual(0, providers.Count);
    }

    [TestMethod]
    public async Task Get_WhenApiReturnsError_ReturnsInternalServerError()
    {
        // Arrange
        SetupMockHttpResponse(HttpStatusCode.InternalServerError, null);

        // Act
        var result = await _controller.Get("John", "Doe", "Seattle", "WA");

        // Assert
        Assert.IsInstanceOfType(result, typeof(StatusCodeResult));
        var statusResult = (StatusCodeResult)result;
        Assert.AreEqual(StatusCodes.Status500InternalServerError, statusResult.StatusCode);
    }

    [TestMethod]
    public async Task Get_WhenDeserializedResponseIsNull_ReturnsEmptyList()
    {
        // Arrange
        SetupMockHttpResponse(HttpStatusCode.OK, "invalid json");

        // Act
        var result = await _controller.Get("John", "Doe", "Seattle", "WA");

        // Assert
        Assert.IsInstanceOfType(result, typeof(OkObjectResult));
        var okResult = (OkObjectResult)result;
        var providers = (List<object>)okResult.Value;
        Assert.AreEqual(0, providers.Count);
    }

    [TestMethod]
    public async Task Get_WhenHttpRequestExceptionOccurs_ReturnsInternalServerError()
    {
        // Arrange
        _mockHttpMessageHandler
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ThrowsAsync(new HttpRequestException("Network error"));

        // Act
        var result = await _controller.Get("John", "Doe", "Seattle", "WA");

        // Assert
        Assert.IsInstanceOfType(result, typeof(StatusCodeResult));
        var statusResult = (StatusCodeResult)result;
        Assert.AreEqual(StatusCodes.Status500InternalServerError, statusResult.StatusCode);

        // Verify error was logged
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((o, t) => true),
                It.IsAny<Exception>(),
                It.Is<Func<It.IsAnyType, Exception?, string>>((o, t) => true)),
            Times.Once);
    }

    [TestMethod]
    public async Task Get_VerifyCorrectQueryParameters()
    {
        // Arrange
        HttpRequestMessage? capturedRequest = null;
        _mockHttpMessageHandler
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .Callback<HttpRequestMessage, CancellationToken>((request, _) => capturedRequest = request)
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent("{\"results\":[]}")
            });

        // Act
        await _controller.Get("John", "Doe", "Seattle", "WA");

        // Assert
        Assert.IsNotNull(capturedRequest);
        var query = capturedRequest.RequestUri?.Query;
        Assert.IsNotNull(query);
        StringAssert.Contains(query, "version=2.1");
        StringAssert.Contains(query, "limit=200");
        StringAssert.Contains(query, "first_name=John");
        StringAssert.Contains(query, "last_name=Doe");
        StringAssert.Contains(query, "city=Seattle");
        StringAssert.Contains(query, "state=WA");
    }
[TestClass]
public class ProviderMapperTests
{
    [TestMethod]
    public void MapToProviderResponses_WithValidResponse_ReturnsMappedProviders()
    {
        // Arrange
        var nppesResponse = new NppesResponse
        {
            results = new List<NPPESResult>
            {
                new()
                {
                    number = "1234567890",
                    basic = new Basic
                    {
                        first_name = "John",
                        last_name = "Doe"
                    },
                    addresses = new List<Address>
                    {
                        new Address
                        {
                            address_1 = "123 Main St",
                            city = "Seattle",
                            state = "WA",
                            postal_code = "98101"
                        }
                    }
                }
            }
        };

        // Act
        var providers = ProviderMapper.MapToProviderResponses(nppesResponse);

        // Assert
        Assert.IsNotNull(providers);
        Assert.AreEqual(1, providers.Count);
        Assert.AreEqual("1234567890", providers[0].npi);
        Assert.AreEqual("Doe, John", providers[0].name);
        Assert.AreEqual("123 Main St", providers[0].address);
        Assert.AreEqual("Seattle", providers[0].city);
        Assert.AreEqual("WA", providers[0].state);
        Assert.AreEqual("98101", providers[0].zip);
    }

    [TestMethod]
    public void MapToProviderResponses_WithNullResponse_ReturnsEmptyList()
    {
        // Act
        var providers = ProviderMapper.MapToProviderResponses(null);

        // Assert
        Assert.IsNotNull(providers);
        Assert.AreEqual(0, providers.Count);
    }

    [TestMethod]
    public void MapToProviderResponses_WithEmptyResults_ReturnsEmptyList()
    {
        // Arrange
        var nppesResponse = new NppesResponse
        {
            results = new List<NPPESResult>()
        };

        // Act
        var providers = ProviderMapper.MapToProviderResponses(nppesResponse);

        // Assert
        Assert.IsNotNull(providers);
        Assert.AreEqual(0, providers.Count);
    }

    [TestMethod]
    public void MapToProviderResponses_WithMissingAddress_ReturnsProviderWithEmptyAddressFields()
    {
        // Arrange
        var nppesResponse = new NppesResponse
        {
            results = new List<NPPESResult>
            {
                new()
                {
                    number = "1234567890",
                    basic = new Basic
                    {
                        first_name = "John",
                        last_name = "Doe"
                    },
                    addresses = new List<Address>() // No addresses provided
                }
            }
        };

        // Act
        var providers = ProviderMapper.MapToProviderResponses(nppesResponse);

        // Assert
        Assert.IsNotNull(providers);
        Assert.AreEqual(1, providers.Count);
        Assert.AreEqual("1234567890", providers[0].npi);
        Assert.AreEqual("Doe, John", providers[0].name);
        Assert.AreEqual(string.Empty, providers[0].address); // Empty address field
        Assert.AreEqual(string.Empty, providers[0].city);    // Empty city field
        Assert.AreEqual(string.Empty, providers[0].state);   // Empty state field
        Assert.AreEqual(string.Empty, providers[0].zip);     // Empty postal code
    }
}
    private void SetupMockHttpResponse(HttpStatusCode statusCode, object? content)
    {
        var response = new HttpResponseMessage(statusCode);
        if (content != null)
        {
            var json = content is string s ? s : JsonSerializer.Serialize(content);
            response.Content = new StringContent(json);
        }

        _mockHttpMessageHandler
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(response);
    }
}

// Models to match your implementation
// public class NppesResponse
// {
//     public List<Result> results { get; set; } = new();
// }
//
// public class Result
// {
//     public string number { get; set; } = "";
//     public Basic basic { get; set; } = new();
//     public List<Address> addresses { get; set; } = new();
// }
//
// public class Basic
// {
//     public string first_name { get; set; } = "";
//     public string last_name { get; set; } = "";
// }
//
// public class Address
// {
//     public string address_1 { get; set; } = "";
//     public string city { get; set; } = "";
//     public string state { get; set; } = "";
//     public string postal_code { get; set; } = "";
// }
//
// public class ProviderResponse
// {
//     public string npi { get; set; } = "";
//     public string name { get; set; } = "";
//     public string address { get; set; } = "";
//     public string city { get; set; } = "";
//     public string state { get; set; } = "";
//     public string zip { get; set; } = "";
// }