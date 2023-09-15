import PageName from "../../../components/commons/PageName";
import PlansComponent from "../../../components/commons/PlansComponent";
import { Helmet } from "react-helmet-async";
const AdminBuyPlan = () => {
 
  
  return (
    <div>
    
      <PageName
        name="Buy Plan"
        breadcrumbs={[
          { name: "Dashboard", href: "/home" },
          { name: "Billings", href: "/home/billing/subscriptions" },
          { name: "Buy Plan", href: "#" },
        ]}
      />
      <PlansComponent />
    </div>
  );
};

export default AdminBuyPlan;
