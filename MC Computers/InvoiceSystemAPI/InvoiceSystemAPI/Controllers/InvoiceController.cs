using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InvoiceSystemAPI.Data;
using InvoiceSystemAPI.Models;

namespace InvoiceSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InvoiceController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Invoice
        [HttpGet]
        public async Task<IActionResult> GetInvoices()
        {
            var invoices = await _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.Items)
                    .ThenInclude(ii => ii.Product)
                .Select(i => new
                {
                    i.InvoiceID,
                    CustomerName = i.Customer.Name,
                    i.InvoiceDate,
                    i.Discount,
                    i.TotalAmount,
                    i.PaidAmount,
                    i.BalanceAmount,
                    Items = i.Items.Select(ii => new
                    {
                        ii.Product.ProductName,
                        ii.Product.Description,
                        ii.Quantity,
                        ii.SubTotal
                    })
                })
                .ToListAsync();

            return Ok(invoices);
        }

        // GET: api/Invoice/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetInvoice(int id)
        {
            var invoice = await _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.Items)
                    .ThenInclude(ii => ii.Product)
                .Where(i => i.InvoiceID == id)
                .Select(i => new
                {
                    i.InvoiceID,
                    CustomerName = i.Customer.Name,
                    i.InvoiceDate,
                    i.Discount,
                    i.TotalAmount,
                    i.PaidAmount,
                    i.BalanceAmount,
                    Items = i.Items.Select(ii => new
                    {
                        ii.Product.ProductName,
                        ii.Product.Description,
                        ii.Quantity,
                        ii.SubTotal
                    })
                })
                .FirstOrDefaultAsync();

            if (invoice == null)
                return NotFound();

            return Ok(invoice);
        }

        // POST: api/Invoice
        [HttpPost]
        public async Task<IActionResult> CreateInvoice([FromBody] Invoice invoice)
        {
            if (invoice == null)
                return BadRequest();

            // Calculate SubTotals for InvoiceItems
            foreach (var item in invoice.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductID);
                if (product != null)
                {
                    item.SubTotal = item.Quantity * product.UnitPrice;
                }
            }

            // Calculate TotalAmount and BalanceAmount
            invoice.TotalAmount = invoice.Items.Sum(i => i.SubTotal) - invoice.Discount;
            invoice.BalanceAmount = invoice.TotalAmount - invoice.PaidAmount;

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            return Ok(invoice);
        }

        // PUT: api/Invoice/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInvoice(int id, [FromBody] Invoice invoice)
        {
            if (id != invoice.InvoiceID)
                return BadRequest();

            // Calculate SubTotals for InvoiceItems
            foreach (var item in invoice.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductID);
                if (product != null)
                {
                    item.SubTotal = item.Quantity * product.UnitPrice;
                }
            }

            // Calculate TotalAmount and BalanceAmount
            invoice.TotalAmount = invoice.Items.Sum(i => i.SubTotal) - invoice.Discount;
            invoice.BalanceAmount = invoice.TotalAmount - invoice.PaidAmount;

            _context.Entry(invoice).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(invoice);
        }

        // DELETE: api/Invoice/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoice(int id)
        {
            var invoice = await _context.Invoices
                .Include(i => i.Items)
                .FirstOrDefaultAsync(i => i.InvoiceID == id);

            if (invoice == null)
                return NotFound();

            _context.InvoiceItems.RemoveRange(invoice.Items);
            _context.Invoices.Remove(invoice);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
