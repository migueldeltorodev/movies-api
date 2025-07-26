namespace Movies.Application.Services;

/// <summary>
/// Servicio para manejo de archivos (upload, delete, etc.)
/// </summary>
public interface IFileService
{
    /// <summary>
    /// Sube un archivo de poster para una película
    /// </summary>
    /// <param name="fileStream">Stream del archivo</param>
    /// <param name="fileName">Nombre original del archivo</param>
    /// <param name="movieId">ID de la película</param>
    /// <param name="cancellationToken">Token de cancelación</param>
    /// <returns>Información del archivo subido</returns>
    Task<FileUploadResult> UploadPosterAsync(Stream fileStream, string fileName, Guid movieId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Elimina un archivo de poster
    /// </summary>
    /// <param name="fileName">Nombre del archivo a eliminar</param>
    /// <param name="cancellationToken">Token de cancelación</param>
    /// <returns>True si se eliminó correctamente</returns>
    Task<bool> DeletePosterAsync(string fileName, CancellationToken cancellationToken = default);

    /// <summary>
    /// Obtiene la URL pública de un poster
    /// </summary>
    /// <param name="fileName">Nombre del archivo</param>
    /// <returns>URL pública del archivo</returns>
    string GetPosterUrl(string fileName);

    /// <summary>
    /// Valida si un archivo es una imagen válida para poster
    /// </summary>
    /// <param name="fileName">Nombre del archivo</param>
    /// <param name="fileSize">Tamaño del archivo en bytes</param>
    /// <returns>Resultado de la validación</returns>
    ValidationResult ValidatePosterFile(string fileName, long fileSize);
}

/// <summary>
/// Resultado de la subida de un archivo
/// </summary>
public record FileUploadResult
{
    public required string FileName { get; init; }
    public required string Url { get; init; }
    public required long Size { get; init; }
    public required string ContentType { get; init; }
}

/// <summary>
/// Resultado de validación de archivo
/// </summary>
public record ValidationResult
{
    public required bool IsValid { get; init; }
    public required string[] Errors { get; init; }

    public static ValidationResult Success() => new() { IsValid = true, Errors = Array.Empty<string>() };
    public static ValidationResult Failure(params string[] errors) => new() { IsValid = false, Errors = errors };
}