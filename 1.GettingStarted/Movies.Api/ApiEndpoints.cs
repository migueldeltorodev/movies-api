namespace Movies.Api;

public static class ApiEndpoints
{
    private const string ApiBase = "api";

    public static class Movies
    {
        private const string Base = $"{ApiBase}/movies";

        public const string Create = Base;
        public const string GetAll = $"{Base}/all";
        public const string Get = $"{Base}/{{idOrSlug}}";
        public const string Update = $"{Base}/{{id:guid}}";
        public const string Delete = $"{Base}/{{id:guid}}";
        
        public const string Rate = $"{Base}/{{id:guid}}/ratings";
        public const string DeleteRating = $"{Base}/{{id:guid}}/ratings";
        
        public const string UploadPoster = $"{Base}/{{id:guid}}/poster";
        public const string DeletePoster = $"{Base}/{{id:guid}}/poster";
        
        public const string ChangeStatus = $"{Base}/{{id:guid}}/status";
    }

    public static class Ratings
    {
        private const string Base = $"{ApiBase}/ratings";
        
        public const string GetUserRatings = $"{Base}/me";
    }

    public static class Auth
    {
        private const string Base = $"{ApiBase}/auth";
        
        public const string Login = Base + "/login";
        public const string Register = Base + "/register";
        public const string Promote = Base + "/promote";
    }
}