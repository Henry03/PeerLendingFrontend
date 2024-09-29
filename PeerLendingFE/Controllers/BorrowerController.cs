using Microsoft.AspNetCore.Mvc;

namespace PeerLendingFE.Controllers
{
    public class BorrowerController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
