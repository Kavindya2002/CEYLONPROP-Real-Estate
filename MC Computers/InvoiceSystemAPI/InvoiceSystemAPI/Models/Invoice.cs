namespace InvoiceSystemAPI.Models
{
    public class Invoice
    {
        public int InvoiceID { get; set; }
        public int CustomerID { get; set; }
        public Customer Customer { get; set; }
        public DateTime InvoiceDate { get; set; }
        public decimal Discount { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal BalanceAmount { get; set; }
        public List<InvoiceItem> Items { get; set; }
    }
}
