import { prisma } from "../../prisma";
import { AppError } from "../../utils/AppError";
import { getMonthRange, parseDateInput } from "../../utils/date";
import { buildMonthlyReportPdf } from "../../utils/pdf";

export class RelatorioService {
  async mensal(userId: number, date?: string) {
    const reference = parseDateInput(date);

    if (!reference) {
      throw new AppError("Data invalida.");
    }

    const { start, end } = getMonthRange(reference);

    const consultas = await prisma.agenda.findMany({
      where: {
        usuarioId: userId,
        data: {
          gte: start,
          lte: end,
        },
      },
      include: {
        paciente: {
          select: {
            nome: true,
          },
        },
      },
      orderBy: [{ data: "asc" }, { hora: "asc" }],
    });

    const totalMes = consultas.reduce((acc, consulta) => acc + Number(consulta.valorConsulta), 0);

    const pdf = await buildMonthlyReportPdf({
      referencia: `${String(reference.getMonth() + 1).padStart(2, "0")}/${reference.getFullYear()}`,
      consultas: consultas.map((consulta) => ({
        paciente: consulta.paciente.nome,
        data: consulta.data.toLocaleDateString("pt-BR"),
        hora: consulta.hora,
        status: consulta.status,
        valorConsulta: Number(consulta.valorConsulta).toFixed(2),
      })),
      totalMes: totalMes.toFixed(2),
    });

    return pdf;
  }
}
