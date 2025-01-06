using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using SimpleIntegrationApi.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;

public class ProvidersControllerTests
{
    private readonly Mock<IHttpClientFactory> _httpClientFactoryMock;
    private readonly Mock<ILogger<ProvidersController>> _loggerMock;
    private readonly ProvidersController _controller;

    public ProvidersControllerTests()
    {
        _httpClientFactoryMock = new Mock<IHttpClientFactory>();
        _loggerMock = new Mock<ILogger<ProvidersController>>();
        _controller = new ProvidersController(_httpClientFactoryMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Get_WithOnlyDefaultQueryParams_ReturnsEmptyList()
    {
        // Arrange
        var httpClientMock = new HttpClient(new FakeHttpMessageHandler());
        _httpClientFactoryMock.Setup(factory => factory.CreateClient(It.IsAny<string>()))
                              .Returns(httpClientMock);

        // Act
        var result = await _controller.Get(null, null, null, null);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var providers = Assert.IsType<List<object>>(okResult.Value);
        Assert.Empty(providers);
    }

    [Fact]
    public async Task Get_WithSuccessfulApiResponse_ReturnsMappedProviders()
    {
        // Arrange
        var fakeApiResponse = new NppesResponse
        {
            results = new List<NppesResult>
            {
                new NppesResult
                {
                    number = "1234567890",
                    basic = new BasicInfo { first_name = "John", last_name = "Doe" },
                    addresses = new List<Address>
                    {
                        new Address
                        {
                            address_1 = "1234 Main St",
                            city = "Springfield",
                            state = "IL",
                            postal_code = "62704"
                        }
                    }
                }
            }
        };
        var serializedResponse = JsonSerializer.Serialize(fakeApiResponse);

        var httpClientMock = new HttpClient(new FakeHttpMessageHandler(serializedResponse, HttpStatusCode.OK));
        _httpClientFactoryMock.Setup(factory => factory.CreateClient(It.IsAny<string>()))
                              .Returns(httpClientMock);

        // Act
        var result = await _controller.Get("John", null, "Springfield", "IL");

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var providers = Assert.IsType<List<ProviderResponse>>(okResult.Value);
        Assert.Single(providers);
        Assert.Equal("1234567890", providers[0].npi);
        Assert.Equal("Doe, John", providers[0].name);
        Assert.Equal("1234 Main St", providers[0].address);
    }

    [Fact]
    public async Task Get_WithApiFailure_ReturnsServerError()
    {
        // Arrange
        var httpClientMock = new HttpClient(new FakeHttpMessageHandler("", HttpStatusCode.InternalServerError));
        _httpClientFactoryMock.Setup(factory => factory.CreateClient(It.IsAny<string>()))
                              .Returns(httpClientMock);

        // Act
        var result = await _controller.Get("John", null, "Springfield", "IL");

        // Assert
        var statusCodeResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, statusCodeResult.StatusCode);
        Assert.Equal("Failed to fetch provider data", ((dynamic)statusCodeResult.Value).error);
    }

    [Fact]
    public async Task Get_WithDeserializationError_ReturnsEmptyList()
    {
        // Arrange
        var httpClientMock = new HttpClient(new FakeHttpMessageHandler("Invalid Json", HttpStatusCode.OK));
        _httpClientFactoryMock.Setup(factory => factory.CreateClient(It.IsAny<string>()))
                              .Returns(httpClientMock);

        // Act
        var result = await _controller.Get("John", null, "Springfield", "IL");

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var providers = Assert.IsType<List<object>>(okResult.Value);
        Assert.Empty(providers);
    }

    [Fact]
    public async Task Get_WithUnhandledException_ReturnsServerError()
    {
        // Arrange
        _httpClientFactoryMock.Setup(factory => factory.CreateClient(It.IsAny<string>()))
                              .Throws(new Exception("Unexpected error"));

        // Act
        var result = await _controller.Get("John", null, "Springfield", "IL");

        // Assert
        var statusCodeResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, statusCodeResult.StatusCode);
        Assert.Equal("Failed to fetch provider data", ((dynamic)statusCodeResult.Value).error);
    }
}