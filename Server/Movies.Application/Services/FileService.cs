using FluentValidation;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Movies.Contracts.Requests;

namespace Movies.Application.Services;

public class FileService : IFileService
{
    private readonly ILogger<FileService> _logger;
    private readonly IValidator<FileUploadRequest> _validator;
    private readonly string _uploadsPath;
    private readonly string _baseUrl;

    public FileService(ILogger<FileService> logger, IConfiguration configuration,
        IValidator<FileUploadRequest> validator)
    {
        _logger = logger;
        _validator = validator;
        _uploadsPath = configuration["FileStorage:UploadsPath"] ??
                       Path.Combine(Directory.GetCurrentDirectory(), "uploads", "posters");
        _baseUrl = configuration["FileStorage:BaseUrl"] ?? "https://localhost:5001/uploads/posters";

        Directory.CreateDirectory(_uploadsPath);
    }

    public async Task<FileUploadResult> UploadPosterAsync(Guid movieId, FileUploadRequest request,
        CancellationToken cancellationToken = default)
    {
        await _validator.ValidateAndThrowAsync(request, cancellationToken);

        try
        {
            var extension = Path.GetExtension(request.FileName).ToLowerInvariant();
            var uniqueFileName = $"{movieId}_{Guid.NewGuid():N}{extension}";
            var filePath = Path.Combine(_uploadsPath, uniqueFileName);

            await using var fileStreamOutput = new FileStream(filePath, FileMode.Create);
            await request.Content.CopyToAsync(fileStreamOutput, cancellationToken);

            _logger.LogInformation("Poster uploaded successfully: {FileName} for movie {MovieId}", uniqueFileName,
                movieId);

            return new FileUploadResult
            {
                FileName = uniqueFileName,
                Url = GetPosterUrl(uniqueFileName),
                Size = request.ContentLength,
                ContentType = request.ContentType
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