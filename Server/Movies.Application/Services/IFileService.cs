using Movies.Contracts.Requests;

namespace Movies.Application.Services;

public interface IFileService
{
    Task<FileUploadResult> UploadPosterAsync(Guid movieId, FileUploadRequest request,
        CancellationToken cancellationToken = default);

    Task<bool> DeletePosterAsync(string fileName, CancellationToken cancellationToken = default);

    string GetPosterUrl(string fileName);
}

public record FileUploadResult
{
    public required string FileName { get; init; }
    public required string Url { get; init; }
    public required long Size { get; init; }
    public required string ContentType { get; init; }
}