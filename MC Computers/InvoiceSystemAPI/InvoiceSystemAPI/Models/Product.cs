namespace InvoiceSystemAPI.Models
{
    public class Product
    {
        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public decimal UnitPrice { get; set; }
        public string? Description { get; set; }
    }
}
