using System.Net;
using System.Text.Json;
using Moq;
using Moq.Protected;

namespace SimpleIntegrationApi.Tests.Helpers
{
    public static class HttpClientMockHelpers
    {
        public static void SetupMockHttpResponse(
            Mock<HttpMessageHandler> mockMessageHandler,
            HttpStatusCode statusCode,
            object? content)
        {
            var response = new HttpResponseMessage(statusCode);

            if (content != null)
            {
                var json = content is string str ? str : JsonSerializer.Serialize(content);
                response.Content = new StringContent(json);
            }

            mockMessageHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(response);
        }
    }
}