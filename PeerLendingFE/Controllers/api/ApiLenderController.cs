using Microsoft.AspNetCore.Mvc;
using PeerLendingFE.DTO.Req;
using System.Net.Http.Headers;
using System.Reflection.Metadata;
using System.Text;
using System.Text.Json;

namespace PeerLendingFE.Controllers.api
{
    public class ApiLenderController : Controller
    {
        private readonly HttpClient _httpClient;

        public ApiLenderController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpPost]
        public async Task<IActionResult> Borrower([FromBody] ReqQueryParametersDto parameter, [FromQuery] string status = "")
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

            var json = JsonSerializer.Serialize(parameter);

            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://localhost:7156/rest/v1/user/Loans?status=" + status, content);

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
        public async Task<IActionResult> Funding([FromBody] ReqFundingDto fund)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

            var json = JsonSerializer.Serialize(fund);

            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://localhost:7156/rest/v1/user/Funding", content);

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
        public async Task<IActionResult> History([FromBody] ReqQueryParametersDto parameter)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

            var json = JsonSerializer.Serialize(parameter);

            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://localhost:7156/rest/v1/user/RepaymentHistory", content);

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

    }
}
