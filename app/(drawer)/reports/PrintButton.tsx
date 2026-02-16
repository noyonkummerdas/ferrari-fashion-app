import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import { useRouter } from "expo-router";

type PrintButtonProps = {
  filteredData: any[];
  title?: string;
  subtitle?: string;
};

export default function PrintButton({ filteredData = [], title = "Report", subtitle }: PrintButtonProps) {
  const router = useRouter();

  const generatePDF = async (data: any[], subTitle?: string) => {
    if (!data || data.length === 0) {
      throw new Error("No data available for printing");
    }

    // Dynamically get table headers from object keys, excluding technical/ID fields
    const excludedKeys = ["_id", "id", "__v", "user", "warehouse", "status", "photo", "createdAt", "updatedAt"];
    const headers = Object.keys(data[0]).filter(key =>
      !excludedKeys.includes(key) &&
      typeof data[0][key] !== 'object'
    );

    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 20px; }
            h1 { text-align: center; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 14px; }
            th { background-color: #fdb714; color: white; }
            .subtitle { text-align: center; color: #666; margin-top: -10px; margin-bottom: 20px; font-size: 16px; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          ${subTitle ? `<div class="subtitle">${subTitle}</div>` : ""}
          <table>
            <tr>
              ${headers.map((key) => `<th>${key.toUpperCase()}</th>`).join("")}
            </tr>
            ${data
        .map(
          (item) => `
                <tr>
                  ${headers.map((key) => `<td>${item[key] ?? "-"}</td>`).join("")}
                </tr>`
        )
        .join("")}
          </table>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });
    return uri;
  };

  const printPDF = async (pdfUri: string) => {
    await Print.printAsync({ uri: pdfUri });
  };

  return (
    <TouchableOpacity
      onPress={async () => {
        try {
          const pdf = await generatePDF(filteredData, subtitle);
          await printPDF(pdf);
          router.back();
        } catch (error) {
          console.error("Error printing report:", error);
        }
      }}
      style={{ marginRight: 16 }}
    >
      <Ionicons name="print-outline" size={28} color="white" />
    </TouchableOpacity>
  );
}

