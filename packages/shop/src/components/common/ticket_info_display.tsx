import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import { FC } from "react";

import type { TicketInfo } from "@frontend/shop/schemas";

// 티켓 참가자 정보 읽기 전용 표. 장바구니 / 주문 내역에서 공용.
export const TicketInfoDisplay: FC<{ language: "ko" | "en"; ticketInfo: TicketInfo }> = ({ language, ticketInfo }) => {
  const titleStr = language === "ko" ? "참가자 정보" : "Participant Information";
  const nameStr = language === "ko" ? "참가자명" : "Name";
  const organizationStr = language === "ko" ? "소속" : "Organization";
  const emailStr = language === "ko" ? "이메일" : "Email";
  const phoneStr = language === "ko" ? "연락처" : "Phone";
  const contributionStr = language === "ko" ? "후원자 한마디" : "Supporter Message";

  return (
    <>
      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell colSpan={2} align="center" sx={{ fontWeight: "bold" }} children={titleStr} />
          </TableRow>
          <TableRow>
            <TableCell sx={{ width: "30%" }} children={nameStr} />
            <TableCell children={ticketInfo.name} />
          </TableRow>
          <TableRow>
            <TableCell children={organizationStr} />
            <TableCell children={ticketInfo.organization || "N/A"} />
          </TableRow>
          <TableRow>
            <TableCell children={emailStr} />
            <TableCell children={ticketInfo.email} />
          </TableRow>
          <TableRow>
            <TableCell children={phoneStr} />
            <TableCell children={ticketInfo.phone} />
          </TableRow>
          {ticketInfo.contribution_message && (
            <TableRow>
              <TableCell children={contributionStr} />
              <TableCell sx={{ whiteSpace: "pre-line" }} children={ticketInfo.contribution_message} />
            </TableRow>
          )}
        </TableBody>
      </Table>
      <br />
    </>
  );
};
