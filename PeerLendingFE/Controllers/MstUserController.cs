using Microsoft.AspNetCore.Mvc;

namespace PeerLendingFE.Controllers
{
    public class MstUserController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
