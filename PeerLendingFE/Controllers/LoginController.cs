using Microsoft.AspNetCore.Mvc;

namespace PeerLendingFE.Controllers
{
    public class LoginController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
