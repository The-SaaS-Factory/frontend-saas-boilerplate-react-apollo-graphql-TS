//Ready
import { Card, Text, Metric, LineChart, Title } from "@tremor/react";
import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_KPIS } from "../../../utils/queries";
import PageName from "../../../components/commons/PageName";
import { toast } from "sonner";
import { serverURL } from "../../../utils/serverUrl";
import { useTranslation } from "react-i18next";
import { KpiGrowthType, KpiStatType, KpiType } from "../../../types/Types";
import Loading from "../../../components/commons/Loading";

const SuperAdminDashboard = () => {
  const { t } = useTranslation("superadmin");

  //States
  const times = [
    { name: t("last_week"), value: 7 },
    { name: t("last_month"), value: 30 },
    { name: t("last_3_month"), value: 90 },
    { name: t("last_6_month"), value: 180 },
    { name: t("last_year"), value: 365 },
  ];
  const [timeSelected, setTimeSelected] = useState(times[0]);
  const [statsCount, setStatsCount] = useState<KpiStatType[]>([]);

  //Funtions and hooks
  const [loadKpis, { loading }] = useLazyQuery(GET_KPIS, {
    fetchPolicy: "network-only",
    onCompleted(data) {
      const kpisCounts: KpiType[] = data.getKpis?.filter(
        (item: KpiType) => item.type === "counts"
      );

      if (kpisCounts.length > 0) {
        const uniqueNames: string[] = [
          ...new Set(kpisCounts.map((item) => item.name)),
        ];

        const kpisCountsDistinctWithVariation: KpiStatType[] = uniqueNames.map(
          (name) => {
            const items: KpiGrowthType[] = kpisCounts.filter(
              (item) => item.name === name
            );

            items.sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            );

            const oldestValue = items[items.length - 1].value;
            const latestValue = items[0].value;
            const value = oldestValue - latestValue;

            return { name, items, value, oldestValue };
          }
        );

        setStatsCount(kpisCountsDistinctWithVariation);
      }
    },
  });

  useEffect(() => {
    loadKpis({
      variables: {
        period: timeSelected?.value,
      },
    });
  }, []);

  const generateKpis = () => {
    const url = serverURL + "/v1/generateKpis";

    const promise = () =>
      new Promise((resolve, reject) =>
        fetch(url, {
          method: "POST",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            resolve(t("kpis_generated"));
          })
          .catch((error) => {
            reject(error);
          })
      );

    toast.promise(promise, {
      loading: t("loading"),
      success: (data) => {
        return data as string;
      },

      error: t("error_kpis"),
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <PageName
        name={t("dashboard")}
        breadcrumbs={[{ name: t("dashboard"), href: "#" }]}
        btn1={{
          name: t("generate_kpis"),
          fn: generateKpis,
        }}
      />
      <div className="mt-5 grid grid-cols-3 gap-5 sm:grid-cols-5">
        {times.map((time, index) => (
          <button
            key={`time-${index}`}
            onClick={() => {
              setTimeSelected(time);
              loadKpis({
                variables: {
                  period: time?.value,
                },
              });
            }}
            className={`${
              timeSelected.name === time.name
                ? "btn-main"
                : "btn-outline-main"
            }`}
          >
            <span>{time.name}</span>
          </button>
        ))}
      </div>
      <div className="max-w-8xl  p-3  mb-56">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {t("variations")}
          </h3>
          <div></div>
          <dl className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3">
            {statsCount.map((stat: KpiStatType) => (
              <Card key={`stat1-${stat.name}`} className="max-w-xs  ">
                <Text>{stat.name}</Text>
                <Metric> {stat.value}</Metric>
              </Card>
            ))}
          </dl>
        </div>

        <h3 className="text-lg my-3 font-medium leading-6 text mt-3">
          {t("total_growth")}
        </h3>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {statsCount.map((statGrowth: KpiStatType, index: number) => {
            console.log(statGrowth);

            const data = statGrowth.items.map((item: KpiGrowthType) => {
              return {
                day: item.createdAt,
                [statGrowth.statGrowth ?? ""]: item.value,
              };
            });
 

            return (
              <Card key={`stat2-${statGrowth.name}`}>
                <Title>
                  {t("total")}: {statGrowth.oldestValue}
                </Title>
                <LineChart
                  key={index}
                  className="mt-6"
                  data={data}
                  index="day"
                  categories={Object.keys(data[0]).slice(1)}
                />
                <div className="flex my-3 capitalize text bg-main p-3">
                  <span> {statGrowth.name}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SuperAdminDashboard;
