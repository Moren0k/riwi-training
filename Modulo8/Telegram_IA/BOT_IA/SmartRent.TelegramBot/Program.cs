using System.Collections.Concurrent;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Text;
using System.Text.Json;
using Telegram.Bot;
using Telegram.Bot.Polling;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using SmartRent.TelegramBot.Models;
using SmartRent.TelegramBot.Models.ApiModels;
using SmartRent.TelegramBot.Services;

class Program
{
    // Token del bot de Telegram
    private static readonly string BotToken = "";

    // API key de Gemini 
    private static readonly string GeminiApiKey = "";

    private static TelegramBotClient botClient = null!;
    private static ConcurrentDictionary<long, BotUser> users = new();
    private static ConcurrentDictionary<long, List<ChatMessage>> chats = new();
    private static SomosRentWiService apiService = new();

    // Ciudades aceptadas
    private static readonly string[] AllowedCities = new[]
    {
        "medellin", "bogota", "cali", "barranquilla"
    };

    static async Task Main()
    {
        botClient = new TelegramBotClient(BotToken);

        var me = await botClient.GetMeAsync();
        Console.WriteLine($"Bot conectado: @{me.Username}");

        var cts = new CancellationTokenSource();
        var receiverOptions = new ReceiverOptions
        {
            AllowedUpdates = Array.Empty<UpdateType>()
        };

        botClient.StartReceiving(
            HandleUpdateAsync,
            HandleErrorAsync,
            receiverOptions,
            cts.Token
        );

        Console.WriteLine("Carlend Bot escuchando mensajes. Presiona ENTER para salir.");
        Console.ReadLine();
        cts.Cancel();
    }

    private static async Task HandleUpdateAsync(ITelegramBotClient bot, Update update, CancellationToken ct)
    {
        if (update.Type != UpdateType.Message)
            return;

        var message = update.Message;
        if (message?.Text == null)
            return;

        long chatId = message.Chat.Id;
        string text = message.Text.Trim();
        string textLower = text.ToLower();

        // Hide password in logs
        if (user.Step == ConversationStep.AskingPassword)
        {
             Console.WriteLine($"Mensaje de {chatId}: [PASSWORD HIDDEN]");
        }
        else
        {
             Console.WriteLine($"Mensaje de {chatId}: {text}");
        }

        // Obtener o crear usuario en memoria
        var user = users.GetOrAdd(chatId, _ => new BotUser
        {
            ChatId = chatId,
            Username = message.Chat.Username ?? ""
        });

        // Guardar mensaje del usuario en historial
        AddChatMessage(chatId, MessageSender.User, text);

        // Comando para cambiar idioma
        if (textLower.StartsWith("/lang"))
        {
            if (textLower.Contains("en"))
            {
                user.Language = "en";
                await bot.SendTextMessageAsync(
                    chatId,
                    "Language set to English.",
                    cancellationToken: ct
                );
            }
            else
            {
                user.Language = "es";
                await bot.SendTextMessageAsync(
                    chatId,
                    "Idioma cambiado a Español.",
                    cancellationToken: ct
                );
            }

            AddChatMessage(chatId, MessageSender.Bot, $"Language set to {user.Language}");
            return;
        }

        // /start
        if (textLower == "/start")
        {
            user.Step = ConversationStep.None;
            user.City = null;
            user.VehicleType = null;
            user.Budget = null;
            user.FullName = null;
            user.Phone = null;
            user.Age = null;

            string welcome;
            if (user.Language == "en")
            {
                welcome =
                    "Welcome to Carlend.\n" +
                    "We help you find the ideal vehicle with secure renting and identity verification.\n\n" +
                    "- Car and motorcycle rentals\n" +
                    "- Document verification\n" +
                    "- Recommendations based on your budget\n\n" +
                    "Type \"start\" to begin\n" +
                    "or \"ask\" if you have questions.\n\n" +
                    "You can change language with /lang es or /lang en.";
            }
            else
            {
                welcome =
                    "Bienvenido a Carlend.\n" +
                    "Te ayudamos a encontrar el vehículo ideal para ti, con renta segura y verificación de identidad.\n\n" +
                    "- Renta de carros y motos\n" +
                    "- Verificación de documentos\n" +
                    "- Recomendaciones según tu presupuesto\n\n" +
                    "Escribe \"empezar\" para iniciar tu proceso\n" +
                    "o \"preguntar\" si tienes dudas.\n\n" +
                    "Puedes cambiar el idioma con /lang es o /lang en.";
            }

            await bot.SendTextMessageAsync(chatId, welcome, cancellationToken: ct);
            AddChatMessage(chatId, MessageSender.Bot, welcome);
            return;
        }

        // Iniciar flujo: empezar / start
        bool userWantsToStart =
            (user.Language == "en" && textLower.Contains("start")) ||
            (user.Language == "es" && textLower.Contains("empezar"));

        if (userWantsToStart && user.Step == ConversationStep.None)
        {
            user.Step = ConversationStep.AskingCity;

            string askCity = user.Language == "en"
                ? "Great. Which city are you in? (Example: Medellin, Bogota, Cali, Barranquilla)"
                : "Perfecto. ¿En qué ciudad estás? (Ejemplo: Medellin, Bogota, Cali, Barranquilla)";

            await bot.SendTextMessageAsync(chatId, askCity, cancellationToken: ct);
            AddChatMessage(chatId, MessageSender.Bot, askCity);
            return;
        }

        // Paso 1: ciudad (con validación)
        if (user.Step == ConversationStep.AskingCity)
        {
            var normalizedCity = textLower
                .Replace("í", "i")
                .Replace("é", "e")
                .Replace("á", "a")
                .Replace("ó", "o")
                .Replace("ú", "u");

            bool isValidCity = AllowedCities.Contains(normalizedCity);

            if (!isValidCity)
            {
                string invalidMsg = user.Language == "en"
                    ? "I don't have that city registered yet. Please choose one of these: Medellin, Bogota, Cali, Barranquilla."
                    : "Esa ciudad aún no la tengo registrada. Por favor elige una de estas: Medellin, Bogota, Cali, Barranquilla.";

                await bot.SendTextMessageAsync(chatId, invalidMsg, cancellationToken: ct);
                AddChatMessage(chatId, MessageSender.Bot, invalidMsg);
                return;
            }

            user.City = Capitalize(normalizedCity);
            user.Step = ConversationStep.AskingVehicleType;

            string askType = user.Language == "en"
                ? "Thanks. What type of vehicle are you looking for?\nType: car, motorcycle, or any."
                : "Gracias. ¿Qué tipo de vehículo buscas?\nEscribe: carro, moto o cualquiera.";

            await bot.SendTextMessageAsync(chatId, askType, cancellationToken: ct);
            AddChatMessage(chatId, MessageSender.Bot, askType);
            return;
        }

        // Paso 2: tipo de vehículo
        if (user.Step == ConversationStep.AskingVehicleType)
        {
            var type = textLower;

            bool validTypeEs = (type == "carro" || type == "moto" || type == "cualquiera");
            bool validTypeEn = (type == "car" || type == "motorcycle" || type == "any");

            bool isValidType = user.Language == "en" ? validTypeEn : validTypeEs;

            if (!isValidType)
            {
                string invalidType = user.Language == "en"
                    ? "Please type: car, motorcycle, or any."
                    : "Por favor escribe solo: carro, moto o cualquiera.";

                await bot.SendTextMessageAsync(chatId, invalidType, cancellationToken: ct);
                AddChatMessage(chatId, MessageSender.Bot, invalidType);
                return;
            }

            user.VehicleType = type;
            user.Step = ConversationStep.AskingBudget;

            string askBudget = user.Language == "en"
                ? "Nice. What is your approximate monthly budget for the rent?\nExample: 800000"
                : "Genial. ¿Cuánto dinero tienes disponible (aprox) al mes para la renta?\nEjemplo: 800000";

            await bot.SendTextMessageAsync(chatId, askBudget, cancellationToken: ct);
            AddChatMessage(chatId, MessageSender.Bot, askBudget);
            return;
        }

        // Paso 3: presupuesto
        if (user.Step == ConversationStep.AskingBudget)
        {
            if (!long.TryParse(textLower.Replace(".", "").Replace(",", ""), out var budget))
            {
                string invalidBudget = user.Language == "en"
                    ? "I didn't understand the amount. Please write only numbers, for example: 800000."
                    : "No entendí el valor. Escríbelo solo en números, por ejemplo: 800000.";

                await bot.SendTextMessageAsync(chatId, invalidBudget, cancellationToken: ct);
                AddChatMessage(chatId, MessageSender.Bot, invalidBudget);
                return;
            }

            user.Budget = budget;

            // Ahora pasamos a pedir nombre completo
            user.Step = ConversationStep.AskingFullName;

            string askName = user.Language == "en"
                ? "Great. Now, please tell me your full name:"
                : "Perfecto. Ahora dime tu nombre completo:";

            await bot.SendTextMessageAsync(chatId, askName, cancellationToken: ct);
            AddChatMessage(chatId, MessageSender.Bot, askName);
            return;
        }

        // Paso 4: nombre completo
        if (user.Step == ConversationStep.AskingFullName)
        {
            if (text.Length < 3)
            {
                string invalidName = user.Language == "en"
                    ? "That name looks too short. Please write your full name."
                    : "Ese nombre se ve muy corto. Escribe por favor tu nombre completo.";

                await bot.SendTextMessageAsync(chatId, invalidName, cancellationToken: ct);
                AddChatMessage(chatId, MessageSender.Bot, invalidName);
                return;
            }

            user.FullName = text;
            user.Step = ConversationStep.AskingPhone;

            string askPhone = user.Language == "en"
                ? "Thanks. Now, what is your phone number? (Only numbers please)"
                : "Gracias. Ahora, ¿cuál es tu número de teléfono? (Solo números, por favor)";

            await bot.SendTextMessageAsync(chatId, askPhone, cancellationToken: ct);
            AddChatMessage(chatId, MessageSender.Bot, askPhone);
            return;
        }

        // Paso 5: teléfono
        if (user.Step == ConversationStep.AskingPhone)
        {
            var phoneDigits = new string(text.Where(char.IsDigit).ToArray());

            if (phoneDigits.Length < 7)
            {
                string invalidPhone = user.Language == "en"
                    ? "That phone number seems too short. Please check it and send it again (only numbers)."
                    : "Ese número de teléfono parece muy corto. Revísalo y envíalo de nuevo (solo números).";

                await bot.SendTextMessageAsync(chatId, invalidPhone, cancellationToken: ct);
                AddChatMessage(chatId, MessageSender.Bot, invalidPhone);
                return;
            }

            user.Phone = phoneDigits;
            user.Step = ConversationStep.AskingAge;

            string askAge = user.Language == "en"
                ? "Got it. Finally, how old are you?"
                : "Perfecto. Por último, ¿cuántos años tienes?";

            await bot.SendTextMessageAsync(chatId, askAge, cancellationToken: ct);
            AddChatMessage(chatId, MessageSender.Bot, askAge);
            return;
        }

        // Paso 6: edad
        if (user.Step == ConversationStep.AskingAge)
        {
            if (!int.TryParse(textLower, out var age) || age < 18 || age > 80)
            {
                string invalidAge = user.Language == "en"
                    ? "I need a valid age between 18 and 80."
                    : "Necesito una edad válida entre 18 y 80 años.";

                await bot.SendTextMessageAsync(chatId, invalidAge, cancellationToken: ct);
                AddChatMessage(chatId, MessageSender.Bot, invalidAge);
                return;
            }

            user.Age = age;
            user.Step = ConversationStep.AskingEmail;

            string askEmail = user.Language == "en"
                ? "Excellent. Now I need your email address to create your account:"
                : "Excelente. Ahora necesito tu correo electrónico para crear tu cuenta:";

            await bot.SendTextMessageAsync(chatId, askEmail, cancellationToken: ct);
            AddChatMessage(chatId, MessageSender.Bot, askEmail);
            return;
        }

        // Paso 7: Email
        if (user.Step == ConversationStep.AskingEmail)
        {
            if (!text.Contains("@") || !text.Contains("."))
            {
                 string invalidEmail = user.Language == "en"
                    ? "That doesn't look like a valid email. Please try again."
                    : "Eso no parece un correo electrónico válido. Intenta de nuevo.";

                await bot.SendTextMessageAsync(chatId, invalidEmail, cancellationToken: ct);
                AddChatMessage(chatId, MessageSender.Bot, invalidEmail);
                return;
            }

            user.Email = text;
            user.Step = ConversationStep.AskingPassword;

            string askPass = user.Language == "en"
                ? "Almost done. Create a password for your account.\n⚠️ IMPORTANT: For your security, I will delete your message immediately after reading it."
                : "Ya casi. Crea una contraseña para tu cuenta.\n⚠️ IMPORTANTE: Por tu seguridad, borraré tu mensaje inmediatamente después de leerlo.";

            await bot.SendTextMessageAsync(chatId, askPass, cancellationToken: ct);
            AddChatMessage(chatId, MessageSender.Bot, askPass);
            return;
        }

        // Paso 8: Password y Registro
        if (user.Step == ConversationStep.AskingPassword)
        {
            // 1. Delete user message for security
            try 
            {
                await botClient.DeleteMessageAsync(chatId, message.MessageId, cancellationToken: ct);
            }
            catch 
            { 
                // Ignore if cannot delete (permissions, etc)
            }

            if (text.Length < 6)
            {
                 string invalidPass = user.Language == "en"
                    ? "Password must be at least 6 characters. Please try again."
                    : "La contraseña debe tener al menos 6 caracteres. Intenta de nuevo.";

                await bot.SendTextMessageAsync(chatId, invalidPass, cancellationToken: ct);
                AddChatMessage(chatId, MessageSender.Bot, invalidPass);
                return;
            }

            user.ApiPassword = text;
            user.Step = ConversationStep.ReadyForRecommendations;

            string registeringMsg = user.Language == "en"
                ? "🔐 Password received and deleted. Registering in the system..."
                : "🔐 Contraseña recibida y eliminada. Registrándote en el sistema...";
                
            await bot.SendTextMessageAsync(chatId, registeringMsg, cancellationToken: ct);

            // Register user in backend API
            var authResponse = await apiService.RegisterUserAsync(user);
            
            if (authResponse != null)
            {
                user.ApiUserId = authResponse.UserId;
                user.ApiToken = authResponse.Token;
                
                string successMsg = user.Language == "en"
                    ? "✅ Registration successful! You can now browse vehicles and create rental requests.\n\nType 'vehicles' to see available options."
                    : "✅ ¡Registro exitoso! Ahora puedes ver vehículos disponibles y crear solicitudes de alquiler.\n\nEscribe 'vehiculos' para ver las opciones disponibles.";
                
                await bot.SendTextMessageAsync(chatId, successMsg, cancellationToken: ct);
                AddChatMessage(chatId, MessageSender.Bot, successMsg);
            }
            else
            {
                string errorMsg = user.Language == "en"
                    ? "⚠️ There was an issue with registration (email might be taken). You can still ask me questions."
                    : "⚠️ Hubo un problema con el registro (el correo podría estar ya registrado). Aún puedes hacerme preguntas.";
                
                await bot.SendTextMessageAsync(chatId, errorMsg, cancellationToken: ct);
                AddChatMessage(chatId, MessageSender.Bot, errorMsg);
            }

            // Enviar correo con los datos del lead
            _ = SendLeadEmailAsync(user);

            return;
        }

        // Mensaje info
        if (textLower.Contains("info"))
        {
            string info = user.Language == "en"
                ? "Carlend is a vehicle rental platform with:\n- Vehicle management\n- User verification\n- Recommendations based on budget\n- Integration with Telegram bot and AI."
                : "Carlend es una plataforma de renta de vehículos con:\n- Gestión de vehículos\n- Verificación de usuarios\n- Recomendaciones según presupuesto\n- Integración con bot de Telegram e IA.";

            await bot.SendTextMessageAsync(chatId, info, cancellationToken: ct);
            AddChatMessage(chatId, MessageSender.Bot, info);
            return;
        }

        // Si el usuario ya terminó el flujo básico, puede ver vehículos o hacer preguntas
        if (user.Step == ConversationStep.ReadyForRecommendations)
        {
            // Check if user wants to see vehicles
            bool wantsVehicles = (user.Language == "en" && textLower.Contains("vehicle")) ||
                                (user.Language == "es" && (textLower.Contains("vehiculo") || textLower.Contains("vehículo") || textLower.Contains("carro")));
            
            if (wantsVehicles)
            {
                string loadingMsg = user.Language == "en"
                    ? "🔍 Searching for available vehicles in your city..."
                    : "🔍 Buscando vehículos disponibles en tu ciudad...";
                
                await bot.SendTextMessageAsync(chatId, loadingMsg, cancellationToken: ct);
                AddChatMessage(chatId, MessageSender.Bot, loadingMsg);
                
                var vehicles = await apiService.GetAvailableVehiclesAsync(user.City);
                
                if (vehicles.Any())
                {
                    user.Step = ConversationStep.BrowsingVehicles;
                    
                    string header = user.Language == "en"
                        ? $"🚗 Available vehicles in {user.City}:\n\n"
                        : $"🚗 Vehículos disponibles en {user.City}:\n\n";
                    
                    var response = new StringBuilder(header);
                    
                    for (int i = 0; i < vehicles.Count; i++)
                    {
                        var car = vehicles[i];
                        response.AppendLine($"[{i + 1}] {car.GetDisplayText()}\n");
                    }
                    
                    response.AppendLine(user.Language == "en"
                        ? "\nReply with the number to select a vehicle, or 'back' to return."
                        : "\nResponde con el número para seleccionar un vehículo, o 'volver' para regresar.");
                    
                    await bot.SendTextMessageAsync(chatId, response.ToString(), cancellationToken: ct);
                    AddChatMessage(chatId, MessageSender.Bot, response.ToString());
                }
                else
                {
                    string noVehicles = user.Language == "en"
                        ? "😕 Sorry, no vehicles are currently available in your city. Please try again later."
                        : "😕 Lo siento, no hay vehículos disponibles en tu ciudad en este momento. Intenta más tarde.";
                    
                    await bot.SendTextMessageAsync(chatId, noVehicles, cancellationToken: ct);
                    AddChatMessage(chatId, MessageSender.Bot, noVehicles);
                }
                
                return;
            }
            
            // Otherwise, use AI for general questions
            string thinkingMsg = user.Language == "en"
                ? "Let me think about that..."
                : "Déjame pensar sobre eso...";

            await bot.SendTextMessageAsync(chatId, thinkingMsg, cancellationToken: ct);
            AddChatMessage(chatId, MessageSender.Bot, thinkingMsg);

            var aiText = await CallGeminiAsync(user, text);

            await bot.SendTextMessageAsync(chatId, aiText, cancellationToken: ct);
            AddChatMessage(chatId, MessageSender.Bot, aiText);
            return;
        }
        
        // Handle vehicle selection
        if (user.Step == ConversationStep.BrowsingVehicles)
        {
            if (textLower == "back" || textLower == "volver")
            {
                user.Step = ConversationStep.ReadyForRecommendations;
                string backMsg = user.Language == "en"
                    ? "Returned to main menu. Type 'vehicles' to see options again."
                    : "Vuelto al menú principal. Escribe 'vehiculos' para ver las opciones de nuevo.";
                
                await bot.SendTextMessageAsync(chatId, backMsg, cancellationToken: ct);
                AddChatMessage(chatId, MessageSender.Bot, backMsg);
                return;
            }
            
            if (int.TryParse(text, out int selection))
            {
                var vehicles = await apiService.GetAvailableVehiclesAsync(user.City);
                
                if (selection > 0 && selection <= vehicles.Count)
                {
                    var selectedVehicle = vehicles[selection - 1];
                    user.SelectedVehicleId = selectedVehicle.Id;
                    user.Step = ConversationStep.AskingRentalDuration;
                    
                    string askHours = user.Language == "en"
                        ? $"Great! You selected:\n\n{selectedVehicle.GetDisplayText()}\n\nHow many hours do you need it for?"
                        : $"¡Genial! Seleccionaste:\n\n{selectedVehicle.GetDisplayText()}\n\n¿Por cuántas horas lo necesitas?";
                    
                    await bot.SendTextMessageAsync(chatId, askHours, cancellationToken: ct);
                    AddChatMessage(chatId, MessageSender.Bot, askHours);
                }
                else
                {
                    string invalidSelection = user.Language == "en"
                        ? "Invalid selection. Please choose a valid number from the list."
                        : "Selección inválida. Por favor elige un número válido de la lista.";
                    
                    await bot.SendTextMessageAsync(chatId, invalidSelection, cancellationToken: ct);
                    AddChatMessage(chatId, MessageSender.Bot, invalidSelection);
                }
                
                return;
            }
        }
        
        // Handle rental duration input
        if (user.Step == ConversationStep.AskingRentalDuration)
        {
            if (int.TryParse(text, out int hours) && hours > 0 && hours <= 720)
            {
                if (string.IsNullOrEmpty(user.SelectedVehicleId) || string.IsNullOrEmpty(user.ApiUserId))
                {
                    string errorMsg = user.Language == "en"
                        ? "Something went wrong. Please start over by typing 'vehicles'."
                        : "Algo salió mal. Por favor comienza de nuevo escribiendo 'vehiculos'.";
                    
                    await bot.SendTextMessageAsync(chatId, errorMsg, cancellationToken: ct);
                    AddChatMessage(chatId, MessageSender.Bot, errorMsg);
                    user.Step = ConversationStep.ReadyForRecommendations;
                    return;
                }
                
                string creatingMsg = user.Language == "en"
                    ? "📝 Creating your rental request..."
                    : "📝 Creando tu solicitud de alquiler...";
                
                await bot.SendTextMessageAsync(chatId, creatingMsg, cancellationToken: ct);
                AddChatMessage(chatId, MessageSender.Bot, creatingMsg);
                
                var rental = await apiService.CreateRentalRequestAsync(user.ApiUserId, user.SelectedVehicleId, hours);
                
                if (rental != null)
                {
                    string successMsg = user.Language == "en"
                        ? $"✅ Rental request created successfully!\n\n" +
                          $"📋 Rental ID: {rental.Id}\n" +
                          $"⏱️ Duration: {rental.EstimatedHours} hours\n" +
                          $"💰 Total Price: ${rental.TotalPrice:N0} COP\n" +
                          $"🔖 Deposit: ${rental.Deposit:N0} COP\n" +
                          $"📊 Status: {rental.Status}\n\n" +
                          $"The company will review your request shortly."
                        : $"✅ ¡Solicitud de alquiler creada exitosamente!\n\n" +
                          $"📋 ID de Alquiler: {rental.Id}\n" +
                          $"⏱️ Duración: {rental.EstimatedHours} horas\n" +
                          $"💰 Precio Total: ${rental.TotalPrice:N0} COP\n" +
                          $"🔖 Depósito: ${rental.Deposit:N0} COP\n" +
                          $"📊 Estado: {rental.Status}\n\n" +
                          $"La empresa revisará tu solicitud pronto.";
                    
                    await bot.SendTextMessageAsync(chatId, successMsg, cancellationToken: ct);
                    AddChatMessage(chatId, MessageSender.Bot, successMsg);
                    
                    user.Step = ConversationStep.ReadyForRecommendations;
                    user.SelectedVehicleId = null;
                }
                else
                {
                    string errorMsg = user.Language == "en"
                        ? "❌ Failed to create rental request. Please try again later or contact support."
                        : "❌ No se pudo crear la solicitud de alquiler. Intenta de nuevo más tarde o contacta soporte.";
                    
                    await bot.SendTextMessageAsync(chatId, errorMsg, cancellationToken: ct);
                    AddChatMessage(chatId, MessageSender.Bot, errorMsg);
                    
                    user.Step = ConversationStep.ReadyForRecommendations;
                }
                
                return;
            }
            else
            {
                string invalidHours = user.Language == "en"
                    ? "Please enter a valid number of hours (1-720)."
                    : "Por favor ingresa un número válido de horas (1-720).";
                
                await bot.SendTextMessageAsync(chatId, invalidHours, cancellationToken: ct);
                AddChatMessage(chatId, MessageSender.Bot, invalidHours);
                return;
            }
        }

        // Mensaje por defecto (antes de terminar el flujo)
        string defaultMsg = user.Language == "en"
            ? "I didn't understand very well. Type \"start\" to begin, or \"info\" to know more about Carlend."
            : "No te entendí muy bien. Escribe \"empezar\" para iniciar tu proceso, o \"info\" para saber más de Carlend.";

        await bot.SendTextMessageAsync(chatId, defaultMsg, cancellationToken: ct);
        AddChatMessage(chatId, MessageSender.Bot, defaultMsg);
    }

    // Manejo de errores del bot
    private static Task HandleErrorAsync(ITelegramBotClient bot, Exception exception, CancellationToken ct)
    {
        Console.WriteLine($"Error en el bot: {exception.Message}");
        return Task.CompletedTask;
    }

    // Guardar historial en memoria
    private static void AddChatMessage(long chatId, MessageSender sender, string text)
    {
        var list = chats.GetOrAdd(chatId, _ => new List<ChatMessage>());
        list.Add(new ChatMessage
        {
            ChatId = chatId,
            Sender = sender,
            Text = text
        });
    }

    // Capitaliza texto (primera letra mayúscula)
    private static string Capitalize(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return text;
        return char.ToUpper(text[0]) + text.Substring(1).ToLower();
    }

    // Enviar correo con la info del lead
    private static async Task SendLeadEmailAsync(BotUser user)
    {
        try
        {
            var message = new MailMessage();

            // CAMBIA ESTO POR TU CORREO Y SMTP REAL
            message.From = new MailAddress("tucorreo@tudominio.com", "Carlend Bot");
            message.To.Add("destino@tudominio.com"); // correo donde llega el lead
            message.Subject = $"Nuevo lead desde Carlend - {user.FullName}";
            message.Body =
                $"Nombre: {user.FullName}\n" +
                $"Teléfono: {user.Phone}\n" +
                $"Edad: {user.Age}\n" +
                $"Ciudad: {user.City}\n" +
                $"Tipo de vehículo: {user.VehicleType}\n" +
                $"Presupuesto: {user.Budget}\n" +
                $"Username Telegram: {user.Username}\n" +
                $"ChatId: {user.ChatId}";

            // Config SMTP (ejemplo genérico, ajústalo a tu proveedor)
            using var client = new SmtpClient("smtp.tudominio.com", 587)
            {
                EnableSsl = true,
                Credentials = new NetworkCredential("tucorreo@tudominio.com", "TU_PASSWORD_SMTP")
            };

            await client.SendMailAsync(message);
            Console.WriteLine("Correo de lead enviado correctamente.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error enviando correo: {ex.Message}");
        }
    }

    // Llamada a Gemini (IA) con prompt general y respuestas cortas
    private static async Task<string> CallGeminiAsync(BotUser user, string userMessage)
    {
        if (string.IsNullOrWhiteSpace(GeminiApiKey))
        {
            return user.Language == "en"
                ? "AI is not configured yet (missing API key)."
                : "La IA todavía no está configurada (falta la API key).";
        }

        using var http = new HttpClient();

        var url =
            "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent"
            + $"?key={GeminiApiKey}";

        var languageLabel = user.Language == "en" ? "English" : "Spanish";

        var prompt =
$"""
You are Carlend Assistant, an AI assistant for a vehicle rental platform called Carlend.

User language: {languageLabel}.
Context you know about this user:
- Full name: {user.FullName ?? "unknown"}
- Phone: {user.Phone ?? "unknown"}
- Age: {(user.Age?.ToString() ?? "unknown")}
- City: {user.City ?? "unknown"}
- Vehicle type: {user.VehicleType ?? "unknown"}
- Monthly budget: {(user.Budget?.ToString() ?? "unknown")}
- Documents verified: {(user.DocumentsVerified ? "yes" : "no")}

User message: "{userMessage}"

Instructions:
1. If the question is about vehicles, renting, prices, documents, recommendations, doubts about what to choose, or about Carlend:
   - Answer as a rental assistant.
   - Be clear, short and friendly.
   - When possible, mention briefly how Carlend helps (catalog, verification, recommendations).

2. If the question is about something general (not about vehicles or Carlend):
   - Answer in a simple and friendly way.
   - At the end, optionally add ONE short line connecting with Carlend. Example (in the correct language):
     - Spanish: "Si en algún momento necesitas ayuda para rentar un vehículo, aquí estoy. Carlend."
     - English: "If you ever need help renting a vehicle, I am here. Carlend."

3. Always answer ONLY in the user language.
4. Avoid very long answers. Prefer 2–4 short bullet points or 2 short paragraphs.
5. Maximum length: around 5 lines. Be very concise.
""";

        var payload = new
        {
            contents = new[]
            {
                new
                {
                    parts = new[]
                    {
                        new { text = prompt }
                    }
                }
            }
        };

        var json = JsonSerializer.Serialize(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await http.PostAsync(url, content);
        Console.WriteLine($"Status Gemini: {response.StatusCode}");

        if (!response.IsSuccessStatusCode)
        {
            Console.WriteLine($"Error Gemini: {response.StatusCode}");
            return user.Language == "en"
                ? "Sorry, I had a problem calling the AI service."
                : "Lo siento, tuve un problema llamando al servicio de IA.";
        }

        var responseJson = await response.Content.ReadAsStringAsync();
        Console.WriteLine("Gemini raw response:");
        Console.WriteLine(responseJson);

        try
        {
            using var doc = JsonDocument.Parse(responseJson);
            var root = doc.RootElement;

            var text =
                root.GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString();

            if (string.IsNullOrWhiteSpace(text))
            {
                return user.Language == "en"
                    ? "I couldn't generate an answer right now."
                    : "No pude generar una respuesta en este momento.";
            }

            return text;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error parseando respuesta de Gemini: {ex.Message}");
            return user.Language == "en"
                ? "I had trouble understanding the AI response."
                : "Tuve problemas interpretando la respuesta de la IA.";
        }
    }
}