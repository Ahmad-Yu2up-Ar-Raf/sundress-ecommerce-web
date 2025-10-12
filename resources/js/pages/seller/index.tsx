import AppLayout from "@/components/ui/core/layout/app/app-layout";
import MainSection from "@/components/ui/core/report/Seller/overview";
import Wrapper from "@/components/ui/core/report/wrapper";
import { PagePropsSellerOverview } from "@/types";

export default function SellerIndex(props: PagePropsSellerOverview) {
  console.log(props.reports);

  return (
    <AppLayout>
      <Wrapper>

<MainSection data={props} />
      </Wrapper>
    </AppLayout>
  );
}
