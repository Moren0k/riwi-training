using SmartRent.TelegramBot.Models;
using SmartRent.TelegramBot.Models.ApiModels;

namespace SmartRent.TelegramBot.Services
{
    public class SomosRentWiService
    {
        private readonly ApiClient _apiClient;

        public SomosRentWiService()
        {
            _apiClient = new ApiClient();
        }

        /// <summary>
        /// Register a new user in the SomosRentWi backend
        /// </summary>
        public async Task<AuthResponse?> RegisterUserAsync(BotUser user)
        {
            try
            {
                // Ensure we have email and password
                if (string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.ApiPassword))
                {
                    Console.WriteLine("[Service] Cannot register: Missing email or password");
                    return null;
                }

                var request = new RegisterRequest
                {
                    Email = user.Email,
                    Password = user.ApiPassword,
                    FullName = user.FullName ?? "Unknown",
                    Phone = user.Phone ?? "",
                    Age = user.Age ?? 18,
                    City = user.City ?? "",
                    Role = "Client"
                };

                Console.WriteLine($"[Service] Registering user: {request.Email}");

                var response = await _apiClient.PostAsync<RegisterRequest, AuthResponse>("/api/auth/register", request);

                if (response != null)
                {
                    Console.WriteLine($"[Service] Registration successful. UserId: {response.UserId}");
                    _apiClient.SetAuthToken(response.Token);
                }

                return response;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Service] Registration error: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Login an existing user
        /// </summary>
        public async Task<AuthResponse?> LoginUserAsync(string email, string password)
        {
            try
            {
                var request = new LoginRequest
                {
                    Email = email,
                    Password = password
                };

                Console.WriteLine($"[Service] Logging in user: {email}");

                var response = await _apiClient.PostAsync<LoginRequest, AuthResponse>("/api/auth/login", request);

                if (response != null)
                {
                    Console.WriteLine($"[Service] Login successful. UserId: {response.UserId}");
                    _apiClient.SetAuthToken(response.Token);
                }

                return response;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Service] Login error: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Get available vehicles, optionally filtered by city
        /// </summary>
        public async Task<List<CarDto>> GetAvailableVehiclesAsync(string? city = null)
        {
            try
            {
                Console.WriteLine($"[Service] Fetching vehicles for city: {city ?? "all"}");

                var endpoint = "/api/Cars";
                var allCars = await _apiClient.GetAsync<List<CarDto>>(endpoint);

                if (allCars == null)
                {
                    Console.WriteLine("[Service] No vehicles returned from API");
                    return new List<CarDto>();
                }

                // Filter by city if specified
                if (!string.IsNullOrWhiteSpace(city))
                {
                    var filtered = allCars
                        .Where(c => c.IsAvailable && 
                                   c.City.Equals(city, StringComparison.OrdinalIgnoreCase))
                        .ToList();
                    
                    Console.WriteLine($"[Service] Found {filtered.Count} available vehicles in {city}");
                    return filtered;
                }

                var available = allCars.Where(c => c.IsAvailable).ToList();
                Console.WriteLine($"[Service] Found {available.Count} available vehicles");
                return available;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Service] Error fetching vehicles: {ex.Message}");
                return new List<CarDto>();
            }
        }

        /// <summary>
        /// Get details for a specific vehicle
        /// </summary>
        public async Task<CarDto?> GetVehicleDetailsAsync(string vehicleId)
        {
            try
            {
                Console.WriteLine($"[Service] Fetching vehicle details for ID: {vehicleId}");

                var endpoint = $"/api/Cars/{vehicleId}";
                var vehicle = await _apiClient.GetAsync<CarDto>(endpoint);

                if (vehicle != null)
                {
                    Console.WriteLine($"[Service] Vehicle found: {vehicle.Brand} {vehicle.Model}");
                }

                return vehicle;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Service] Error fetching vehicle details: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Create a rental request
        /// </summary>
        public async Task<RentalDto?> CreateRentalRequestAsync(string clientId, string carId, int estimatedHours)
        {
            try
            {
                Console.WriteLine($"[Service] Creating rental request - Client: {clientId}, Car: {carId}, Hours: {estimatedHours}");

                var request = new CreateRentalRequest
                {
                    ClientId = clientId,
                    CarId = carId,
                    EstimatedHours = estimatedHours
                };

                var rental = await _apiClient.PostAsync<CreateRentalRequest, RentalDto>("/api/Rentals", request);

                if (rental != null)
                {
                    Console.WriteLine($"[Service] Rental created successfully. ID: {rental.Id}");
                }

                return rental;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Service] Error creating rental: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Set authentication token for API calls
        /// </summary>
        public void SetAuthToken(string token)
        {
            _apiClient.SetAuthToken(token);
        }
    }
}
