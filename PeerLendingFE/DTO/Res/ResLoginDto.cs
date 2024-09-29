namespace PeerLendingFE.DTO.Res
{
    public class ResLoginDto
    {
        public class LoginResponse
        {
            public bool Success { get; set; }
            public string message { get; set; }
            public UserData data { get; set; }
        }

            public class UserData
        {
            //public string id { get; set; }
            //public string name { get; set; }
            //public string role { get; set; }
            public string token { get; set; }
        }
    }
}
