namespace Identity.Api.Services;

public class ConsoleEmailSender : IEmailSender
{
    private readonly ILogger<ConsoleEmailSender> _logger;

    public ConsoleEmailSender(ILogger<ConsoleEmailSender> logger)
    {
        _logger = logger;
    }

    public Task SendEmailAsync(string email, string subject, string message)
    {
        _logger.LogInformation("--- New Email ---");
        _logger.LogInformation("To: {Email}", email);
        _logger.LogInformation("Subject: {Subject}", subject);
        _logger.LogInformation("Body: {Message}", message);
        return Task.CompletedTask;
    }
}