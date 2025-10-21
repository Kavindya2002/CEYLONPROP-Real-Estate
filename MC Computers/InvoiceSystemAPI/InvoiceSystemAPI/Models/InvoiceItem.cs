namespace InvoiceSystemAPI.Models
{
    public class InvoiceItem
    {
        public int InvoiceItemID { get; set; }
        public int InvoiceID { get; set; }
        public Invoice Invoice { get; set; }

        public int ProductID { get; set; }
        public Product Product { get; set; }

        public int Quantity { get; set; }
        public decimal SubTotal { get; set; }
    }
}
