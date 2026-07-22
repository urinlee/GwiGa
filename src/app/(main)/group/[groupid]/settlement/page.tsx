import { SettlementDashboard } from "@/features/settlement/components/SettlementDashboard/SettlementDashboard";
import Link from "next/link";


export default function SettlementPage() {
    const defaultData = {
        total: { collected: 1000, spent: 500 },
        lastMonth: { collected: 3000, spent: 1500 },
        fixedMonthly: { collected: 1500, spent: 750 },
        person: { min: 100, max: 500 },
    };

    return(
        <div>
            <SettlementDashboard {...defaultData} />
        </div>
    )
}