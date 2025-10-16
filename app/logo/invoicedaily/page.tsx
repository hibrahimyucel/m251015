import MemberRoute from "@/components/authMember";
import InvoiceDailyTable from "./components/invoiceDailyTable";
export default function InvoiceDailyPage() {
  return (
    <MemberRoute>
      <InvoiceDailyTable />
    </MemberRoute>
  );
}
