using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PeerLendingFE.DTO.Req
{
    public class ReqQueryParametersDto
    {
        public string Search { get; set; } = String.Empty;
        public string SortBy { get; set; } = String.Empty;
        public bool Ascending { get; set; }
        public int PageNumber { get; set; } = 1;
    }
}
