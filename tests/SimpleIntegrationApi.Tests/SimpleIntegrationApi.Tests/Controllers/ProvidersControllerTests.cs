using Moq;
using Moq.Protected;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using SimpleIntegrationApi.Controllers;
using FluentAssertions;
using Microsoft.Extensions.Logging;

[TestClass]
public class ProvidersControllerTests
{
    [TestMethod]
    public async Task TestGetProvidersReturnsOkResult()
    {
        // Arrange
        var mockHttpMessageHandler = new Mock<HttpMessageHandler>();
        mockHttpMessageHandler
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            )
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent("[{\"key\":\"value\"}]") // Mocked JSON response
            });

        var httpClientFactoryMock = new Mock<IHttpClientFactory>();
        var httpClient = new HttpClient(mockHttpMessageHandler.Object);
        httpClientFactoryMock
            .Setup(_ => _.CreateClient(It.IsAny<string>()))
            .Returns(httpClient);

        var loggerMock = new Mock<ILogger<ProvidersController>>();

        var controller = new ProvidersController(httpClientFactoryMock.Object, loggerMock.Object);

        // Act
        var result = await controller.Get(
            firstName: "John",
            lastName: "Doe",
            city: "New York",
            state: "NY"
        );

        // Assert
        Assert.IsInstanceOfType(result, typeof(OkObjectResult));
        var okResult = result as OkObjectResult;
        okResult.Should().NotBeNull(); // FluentAssertions check
        Assert.IsNotNull(okResult);
        // Optional: Verify the returned value if needed
        // okResult.Value.Should().BeEquivalentTo(new[] { new { key = "value" } });
    }
}