using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace SmartRent.TelegramBot.Services
{
    public class ApiClient
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;
        private string? _jwtToken;

        public ApiClient(string baseUrl = "https://somosrentwi-backend-production.up.railway.app")
        {
            _baseUrl = baseUrl.TrimEnd('/');
            _httpClient = new HttpClient
            {
                Timeout = TimeSpan.FromSeconds(30)
            };
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }

        public void SetAuthToken(string token)
        {
            _jwtToken = token;
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        }

        public void ClearAuthToken()
        {
            _jwtToken = null;
            _httpClient.DefaultRequestHeaders.Authorization = null;
        }

        public async Task<TResponse?> GetAsync<TResponse>(string endpoint)
        {
            try
            {
                var url = $"{_baseUrl}{endpoint}";
                Console.WriteLine($"[API] GET {url}");

                var response = await _httpClient.GetAsync(url);
                var content = await response.Content.ReadAsStringAsync();

                Console.WriteLine($"[API] Response Status: {response.StatusCode}");

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"[API] Error Response: {content}");
                    return default;
                }

                var result = JsonSerializer.Deserialize<TResponse>(content, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[API] GET Exception: {ex.Message}");
                return default;
            }
        }

        public async Task<TResponse?> PostAsync<TRequest, TResponse>(string endpoint, TRequest data)
        {
            try
            {
                var url = $"{_baseUrl}{endpoint}";
                Console.WriteLine($"[API] POST {url}");

                var json = JsonSerializer.Serialize(data);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync(url, content);
                var responseContent = await response.Content.ReadAsStringAsync();

                Console.WriteLine($"[API] Response Status: {response.StatusCode}");

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"[API] Error Response: {responseContent}");
                    return default;
                }

                var result = JsonSerializer.Deserialize<TResponse>(responseContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[API] POST Exception: {ex.Message}");
                return default;
            }
        }

        public async Task<bool> PostAsync<TRequest>(string endpoint, TRequest data)
        {
            try
            {
                var url = $"{_baseUrl}{endpoint}";
                Console.WriteLine($"[API] POST {url}");

                var json = JsonSerializer.Serialize(data);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync(url, content);
                var responseContent = await response.Content.ReadAsStringAsync();

                Console.WriteLine($"[API] Response Status: {response.StatusCode}");

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"[API] Error Response: {responseContent}");
                }

                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[API] POST Exception: {ex.Message}");
                return false;
            }
        }
    }
}
