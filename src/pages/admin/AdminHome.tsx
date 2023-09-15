import { Grid, Col, Card, Text, Metric } from "@tremor/react";
import useCheckMembership from "../../hooks/useCheckMembership";
import PageName from "../../components/commons/PageName";
import { useTranslation } from "react-i18next";
const AdminHome = () => {
  useCheckMembership();
  const { t } = useTranslation("admin");
  return (
    <div>
      <PageName
        name={t("dashboard")}
        breadcrumbs={[{ name: t("dashboard"), href: "/#" }]}
      />
      <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-2">
        <Col numColSpan={1} numColSpanLg={2}>
          <Card>
            <Text>Title</Text>
            <Metric>KPI 1</Metric>
          </Card>
        </Col>
        <Card>
          <Text>Title</Text>
          <Metric>KPI 2</Metric>
        </Card>
        <Col>
          <Card>
            <Text>Title</Text>
            <Metric>KPI 3</Metric>
          </Card>
        </Col>
        <Card>
          <Text>Title</Text>
          <Metric>KPI 4</Metric>
        </Card>
        <Card>
          <Text>Title</Text>
          <Metric>KPI 5</Metric>
        </Card>
      </Grid>
    </div>
  );
};

export default AdminHome;
