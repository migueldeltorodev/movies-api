namespace Movies.Contracts.Requests;

public record FileUploadRequest
{
    public required Stream Content { get; init; }
    public required string FileName { get; init; }
    public required string ContentType { get; init; }
    public required long ContentLength { get; init; }
}