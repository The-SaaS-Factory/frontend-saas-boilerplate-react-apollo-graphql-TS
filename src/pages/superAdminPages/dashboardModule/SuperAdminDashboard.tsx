//Ready
import { Card, Text, Metric, LineChart, Title } from "@tremor/react";
import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { KpiGrowthType, KpiStatType, KpiType } from "./dashboardTypes";
import { GET_KPIS } from "./dashboardGraphql";
import PageLoader from "@/components/ui/loaders/PageLoader";
import PageName from "@/components/ui/commons/PageName";
import useSuperAdmin from "@/utils/hooks/useSuperAdmin";
import ForbiddenPage from "@/components/layouts/errors/ForbiddenPage";
const serverURL = import.meta.env.VITE_SERVER_BASE_URL;

const SuperAdminDashboard = () => {
  //States
  const times = [
    { name: "Last week", value: 7 },
    { name: "Last month", value: 30 },
    { name: "Last 3 months", value: 90 },
    { name: "Last 6 months", value: 180 },
    { name: "Last year", value: 365 },
  ];
  const [timeSelected, setTimeSelected] = useState(times[0]);
  const [statsCount, setStatsCount] = useState<KpiStatType[]>([]);
  const { hasModulePermission } = useSuperAdmin("superAdmin:dashboard:read");

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
    const url = serverURL + "/api/v1/generateKpis";

    const promise = () =>
      new Promise((resolve, reject) =>
        fetch(url, {
          method: "POST",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            resolve("Kpis generated successfully");
          })
          .catch((error) => {
            reject(error);
          })
      );

    toast.promise(promise, {
      loading: "Loading",
      success: (data) => {
        return data as string;
      },

      error: "Error",
    });
  };

  if (loading) {
    return <PageLoader />;
  }

  const parseStatName = (name: string) => {
    const nameSplitted = name.split("_");
    const nameParsed = nameSplitted.map(
      (item) => item.charAt(0).toUpperCase() + item.slice(1)
    );
    return nameParsed.join(" ");
  };

  if (!hasModulePermission) {
    return (
      <div className="">
        <ForbiddenPage />
      </div>
    );
  }

  return (
    <>
      <PageName
        name={"Dashboard"}
        btn1={{
          name: "Generate Kpis",
          fn: generateKpis,
        }}
      />
      <div>
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
              <span className="text-primary">{time.name}</span>
            </button>
          ))}
        </div>
        <div className="max-w-8xl  p-3  mb-56">
          <div>
            <h3 className="text-title text-primary">Variations</h3>
            <div></div>
            <dl className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-5 lg:grid-cols-4">
              {statsCount.map((stat: KpiStatType) => (
                <Card key={`stat1-${stat.name}`} className="max-w-xs  ">
                  <Text>{parseStatName(stat.name)}</Text>
                  <Metric> {stat.value}</Metric>
                </Card>
              ))}
            </dl>
          </div>

          <h3 className="text-title text-primary mt-3">Growth</h3>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {statsCount.map((statGrowth: KpiStatType, index: number) => {
              const data = statGrowth.items.map((item: KpiGrowthType) => {
                return {
                  day: item.createdAt,
                  [statGrowth.statGrowth ?? ""]: item.value,
                };
              });

              return (
                <Card key={`stat2-${statGrowth.name}`}>
                  <Title className="text-title text-primary">
                    Total: {statGrowth.oldestValue}
                  </Title>
                  <LineChart
                    key={index}
                    className="mt-6"
                    data={data}
                    index="day"
                    categories={Object.keys(data[0]).slice(1)}
                  />
                  <div className="flex my-3 capitalize text bg-main p-3">
                    <span className="text-title text-primary">
                      {" "}
                      {parseStatName(statGrowth.name)}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default SuperAdminDashboard;
