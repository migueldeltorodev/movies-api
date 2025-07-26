using System.Reflection;
using Dapper;
using DbUp;

namespace Movies.Application.Database;

public class DbInitializer
{
    private readonly string _connectionString;

    public DbInitializer(string connectionString)
    {
        _connectionString = connectionString;
    }

    public Task InitializeAsync()
    {
        Console.WriteLine("Starting database initialization...");

        EnsureDatabase.For.PostgresqlDatabase(_connectionString);

        var upgrader = DeployChanges.To.PostgresqlDatabase(_connectionString)
            .WithScriptsEmbeddedInAssembly(typeof(DbInitializer).Assembly)
            .LogToConsole()
            .Build();

        Console.WriteLine($"Checking if upgrade is required...");

        if (upgrader.IsUpgradeRequired())
        {
            Console.WriteLine("Upgrade is required. Performing upgrade...");
            var result = upgrader.PerformUpgrade();

            if (!result.Successful)
            {
                Console.WriteLine($"Database upgrade failed: {result.Error}");
                throw new Exception($"Database upgrade failed: {result.Error}");
            }

            Console.WriteLine("Database upgrade completed successfully!");
        }
        else
        {
            Console.WriteLine("No upgrade required. Database is up to date.");
        }

        return Task.CompletedTask;
    }
}