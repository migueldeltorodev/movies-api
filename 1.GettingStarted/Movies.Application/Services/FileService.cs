using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Movies.Application.Services;

public class FileService : IFileService
{
    private readonly ILogger<FileService> _logger;
    private readonly string _uploadsPath;
    private readonly string _baseUrl;

    private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
    private static readonly string[] AllowedContentTypes = { "image/jpeg", "image/png", "image/webp" };
    private const long MaxFileSize = 5 * 1024 * 1024; // 5MB
    private const int MaxImageWidth = 2000;
    private const int MaxImageHeight = 3000;

    public FileService(ILogger<FileService> logger, IConfiguration configuration)
    {
        _logger = logger;
        _uploadsPath = configuration["FileStorage:UploadsPath"] ??
                       Path.Combine(Directory.GetCurrentDirectory(), "uploads", "posters");
        _baseUrl = configuration["FileStorage:BaseUrl"] ?? "https://localhost:5001/uploads/posters";

        Directory.CreateDirectory(_uploadsPath);
    }

    public async Task<FileUploadResult> UploadPosterAsync(Stream fileStream, string fileName, Guid movieId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var validation = ValidatePosterFile(fileName, fileStream.Length);
            if (!validation.IsValid)
            {
                throw new InvalidOperationException($"Archivo inválido: {string.Join(", ", validation.Errors)}");
            }

            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            var uniqueFileName = $"{movieId}_{Guid.NewGuid():N}{extension}";
            var filePath = Path.Combine(_uploadsPath, uniqueFileName);

            using var fileStreamOutput = new FileStream(filePath, FileMode.Create);
            await fileStream.CopyToAsync(fileStreamOutput, cancellationToken);

            _logger.LogInformation("Poster uploaded successfully: {FileName} for movie {MovieId}", uniqueFileName,
                movieId);

            return new FileUploadResult
            {
                FileName = uniqueFileName,
                Url = GetPosterUrl(uniqueFileName),
                Size = fileStream.Length,
                ContentType = GetContentType(extension)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading poster for movie {MovieId}", movieId);
            throw;
        }
    }

    public async Task<bool> DeletePosterAsync(string fileName, CancellationToken cancellationToken = default)
    {
        try
        {
            if (string.IsNullOrEmpty(fileName))
                return true;

            var filePath = Path.Combine(_uploadsPath, fileName);

            if (File.Exists(filePath))
            {
                await Task.Run(() => File.Delete(filePath), cancellationToken);
                _logger.LogInformation("Poster deleted successfully: {FileName}", fileName);
                return true;
            }

            _logger.LogWarning("Attempted to delete non-existent poster: {FileName}", fileName);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting poster: {FileName}", fileName);
            return false;
        }
    }

    public string GetPosterUrl(string fileName)
    {
        if (string.IsNullOrEmpty(fileName))
            return string.Empty;

        return $"{_baseUrl}/{fileName}";
    }

    public ValidationResult ValidatePosterFile(string fileName, long fileSize)
    {
        var errors = new List<string>();

        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
        {
            errors.Add($"Extensión no permitida. Extensiones válidas: {string.Join(", ", AllowedExtensions)}");
        }

        if (fileSize > MaxFileSize)
        {
            errors.Add($"Archivo demasiado grande. Tamaño máximo: {MaxFileSize / (1024 * 1024)}MB");
        }

        if (fileSize == 0)
        {
            errors.Add("El archivo está vacío");
        }

        if (string.IsNullOrWhiteSpace(fileName))
        {
            errors.Add("Nombre de archivo inválido");
        }

        return errors.Count == 0 ? ValidationResult.Success() : ValidationResult.Failure(errors.ToArray());
    }

    private static string GetContentType(string extension)
    {
        return extension switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".webp" => "image/webp",
            _ => "application/octet-stream"
        };
    }
}