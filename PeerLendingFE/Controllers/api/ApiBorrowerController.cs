using Microsoft.AspNetCore.Mvc;
using PeerLendingFE.DTO.Req;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace PeerLendingFE.Controllers.api
{
    public class ApiBorrowerController : Controller
    {
        private readonly HttpClient _httpClient;

        public ApiBorrowerController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpPost]
        public async Task<IActionResult> History([FromBody] ReqQueryParametersDto parameter, [FromQuery] string status = "")
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

            var json = JsonSerializer.Serialize(parameter);

            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://localhost:7156/rest/v1/user/LoansById", content);

            var responseData = await response.Content.ReadAsStringAsync();
            if (response.IsSuccessStatusCode)
            {
                return Ok(responseData);
            }
            else
            {
                return StatusCode((int)response.StatusCode, response);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Loan([FromBody] ReqLoanDto loan)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var json = JsonSerializer.Serialize(loan);

            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://localhost:7156/rest/v1/user/NewLoan", content);

            var responseData = await response.Content.ReadAsStringAsync();
            if (response.IsSuccessStatusCode)
            {
                return Ok(responseData);
            }
            else
            {
                return StatusCode((int)response.StatusCode, responseData);
            }
        }

        [HttpGet]
        public async Task<IActionResult> Installment([FromQuery] string id)
        {

            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.GetAsync($"https://localhost:7156/rest/v1/user/Installment?id={id}");

            var responseData = await response.Content.ReadAsStringAsync();
            if (response.IsSuccessStatusCode)
            {
                return Ok(responseData);
            }
            else
            {
                return StatusCode((int)response.StatusCode, responseData);
            }

        }

        [HttpPost]
        public async Task<IActionResult> Installment([FromBody] ReqInstallmentsDto installment)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var json = JsonSerializer.Serialize(installment);

            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://localhost:7156/rest/v1/user/Installment", content);

            var responseData = await response.Content.ReadAsStringAsync();
            if (response.IsSuccessStatusCode)
            {
                return Ok(responseData);
            }
            else
            {
                return StatusCode((int)response.StatusCode, responseData);
            }
        }

        [HttpGet]
        public async Task<IActionResult> RepaidDetail([FromQuery] string id)
        {

            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.GetAsync($"https://localhost:7156/rest/v1/user/RepaidDetail?idLoan={id}");

            var responseData = await response.Content.ReadAsStringAsync();
            if (response.IsSuccessStatusCode)
            {
                return Ok(responseData);
            }
            else
            {
                return StatusCode((int)response.StatusCode, responseData);
            }

        }
    }
}
