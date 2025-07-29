using FluentValidation;
using Movies.Contracts.Requests;

namespace Movies.Application.Validators;

public class FileUploadRequestValidator : AbstractValidator<FileUploadRequest>
{
    private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
    private const long MaxFileSize = 5 * 1024 * 1024; // 5MB

    public FileUploadRequestValidator()
    {
        RuleFor(x => x.FileName)
            .NotEmpty()
            .WithMessage("El nombre del archivo no puede estar vacío.")
            .Must(HaveAllowedExtension)
            .WithMessage(
                $"La extensión del archivo no es válida. Extensiones permitidas: {string.Join(", ", AllowedExtensions)}");

        RuleFor(x => x.ContentLength)
            .NotEmpty()
            .WithMessage("El archivo no puede estar vacío.")
            .LessThanOrEqualTo(MaxFileSize)
            .WithMessage(
                $"El archivo es demasiado grande. El tamaño máximo permitido es de {MaxFileSize / (1024 * 1024)}MB.");
    }

    private static bool HaveAllowedExtension(string fileName)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        return AllowedExtensions.Contains(extension);
    }
}