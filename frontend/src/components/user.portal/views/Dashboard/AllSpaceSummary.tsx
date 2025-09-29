import NetWorthSummary from "./NetWorthSummary";
import AssetsSummary from "./AssetsSummary";
import LiabilitiesSummary from "./LiabilitiesSummary";

function AllSpaceSummary({ currency, summary }: { currency: string, summary: any }) {

    return (
        <>
            <NetWorthSummary currency={currency}  summary={summary}/>
            <AssetsSummary currency={currency} summary={summary}/>
            <LiabilitiesSummary currency={currency} summary={summary}/>
        </>
    )

}

export default AllSpaceSummary;