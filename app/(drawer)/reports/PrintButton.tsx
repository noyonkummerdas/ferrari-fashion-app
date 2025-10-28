// import React from "react";
// import { TouchableOpacity } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import * as Print from "expo-print";

// type PrintButtonProps = {
//   filteredData: any[];
//   title?: string;
// };

// export default function PrintButton({ filteredData, title = "Report" }: PrintButtonProps) {

//   const generatePDF = async (data: any[]) => {
//     const html = `
//       <html>
//         <head>
//           <style>
//             body { font-family: Arial; padding: 20px; }
//             h1 { text-align: center; color: #333; }
//             table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//             th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//             th { background-color: #fdb714; color: white; }
//           </style>
//         </head>
//         <body>
//           <h1>${title}</h1>
//           <table>
//             <tr>
//               <th>Date</th>
//               <th>Type</th>
//               <th>Amount</th>
//             </tr>
//             ${data
//               .map(
//                 (item) => `
//                 <tr>
//                   <td>${new Date(item.date || item.createdAt).toLocaleDateString()}</td>
//                   <td>${item.type || item.source || ""}</td>
//                   <td>${item.amount}</td>
//                 </tr>`
//               )
//               .join("")}
//           </table>
//         </body>
//       </html>
//     `;
//     const { uri } = await Print.printToFileAsync({ html });
//     return uri;
//   };

//   const printPDF = async (pdfUri: string) => {
//     await Print.printAsync({ uri: pdfUri });
//   };

//   return (
//     <TouchableOpacity
//       onPress={async () => {
//         try {
//           const pdf = await generatePDF(filteredData);
//           await printPDF(pdf);
//           router.back()
//         } catch (error) {
//           console.error("Error printing report:", error);
//         }
//       }}
//       style={{ marginRight: 16 }}
//     >
//       <Ionicons name="print-outline" size={28} color="white" />
//     </TouchableOpacity>
//   );
// }


// import React from "react";
// import { TouchableOpacity } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import * as Print from "expo-print";
// import { router } from "expo-router"; // ✅ import router

// type PrintButtonProps = {
//   filteredData: any[];
//   title?: string;
// };

// export default function PrintButton({ filteredData, title = "Report" }: PrintButtonProps) {

//   const generatePDF = async (data: any[]) => {
//     const html = `
//       <html>
//         <head>
//           <style>
//             body { font-family: Arial; padding: 20px; }
//             h1 { text-align: center; color: #333; }
//             table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//             th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//             th { background-color: #fdb714; color: white; }
//           </style>
//         </head>
//         <body>
//           <h1>${title}</h1>
//           <table>
//             <tr>
//               <th>Date</th>
//               <th>Type</th>
//               <th>Amount</th>
//             </tr>
//             ${data
//               .map(
//                 (item) => `
//                 <tr>
//                   <td>${new Date(item.date || item.createdAt).toLocaleDateString()}</td>
//                   <td>${item.type || item.source || ""}</td>
//                   <td>${item.amount}</td>
//                 </tr>`
//               )
//               .join("")}
//           </table>
//         </body>
//       </html>
//     `;
//     const { uri } = await Print.printToFileAsync({ html });
//     return uri;
//   };

//   const printPDF = async (pdfUri: string) => {
//     await Print.printAsync({ uri: pdfUri });
//   };

//   return (
//     <TouchableOpacity
//       onPress={async () => {
//         try {
//           const pdf = await generatePDF(filteredData);
//           await printPDF(pdf);
//           // print শেষ হলে back করাবে
//           router.back();
//         } catch (error) {
//           console.error("Error printing report:", error);
//         }
//       }}
//       style={{ marginRight: 16 }}
//     >
//       <Ionicons name="print-outline" size={28} color="white" />
//     </TouchableOpacity>
//   );
// }

import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import { useRouter } from "expo-router";

type PrintButtonProps = {
  filteredData: any[];
  title?: string;
};

export default function PrintButton({ filteredData = [], title = "Report" }: PrintButtonProps) {
  const router = useRouter();

  const generatePDF = async (data: any[]) => {
    if (!data || data.length === 0) {
      throw new Error("No data available for printing");
    }

    // Dynamically get table headers from object keys
    const headers = Object.keys(data[0]);

    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 20px; }
            h1 { text-align: center; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 14px; }
            th { background-color: #fdb714; color: white; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
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
          const pdf = await generatePDF(filteredData);
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

