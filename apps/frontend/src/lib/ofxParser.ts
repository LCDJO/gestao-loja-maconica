import { OFXTransaction } from "./types";

/**
 * Parser simplificado para arquivos OFX
 * Extrai as transações básicas do arquivo
 */
export function parseOFX(content: string): {
  transactions: OFXTransaction[];
  bankName: string;
  accountNumber: string;
} {
  const transactions: OFXTransaction[] = [];
  let bankName = "Banco Desconhecido";
  let accountNumber = "****";

  try {
    // Extrair nome do banco
    const bankMatch = content.match(/<ORG>([^<]+)<\/ORG>/);
    if (bankMatch) {
      bankName = bankMatch[1];
    }

    // Extrair número da conta
    const accountMatch = content.match(/<ACCTID>([^<]+)<\/ACCTID>/);
    if (accountMatch) {
      accountNumber = accountMatch[1];
    }

    // Extrair transações
    const stmtTrnRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/g;
    let match;

    while ((match = stmtTrnRegex.exec(content)) !== null) {
      const transactionBlock = match[1];

      // Extrair tipo de transação
      const typeMatch = transactionBlock.match(/<TRNTYPE>([^<]+)<\/TRNTYPE>/);
      const type = typeMatch ? (typeMatch[1] === "DEBIT" ? "debit" : "credit") : "credit";

      // Extrair data
      const dateMatch = transactionBlock.match(/<DTPOSTED>(\d{8})/);
      let date = new Date().toISOString().split("T")[0];
      if (dateMatch) {
        const dateStr = dateMatch[1];
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        date = `${year}-${month}-${day}`;
      }

      // Extrair valor
      const amountMatch = transactionBlock.match(/<TRNAMT>([^<]+)<\/TRNAMT>/);
      const amount = amountMatch ? Math.abs(parseFloat(amountMatch[1])) : 0;

      // Extrair descrição/memo
      const memoMatch = transactionBlock.match(/<MEMO>([^<]+)<\/MEMO>/);
      const memo = memoMatch ? memoMatch[1] : "";

      if (amount > 0) {
        transactions.push({
          id: `ofx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          date,
          amount,
          description: memo || "Transferência bancária",
          type,
          memo,
        });
      }
    }

    // Se não encontrou transações no formato OFX padrão, tenta formato alternativo
    if (transactions.length === 0) {
      transactions.push(...parseSimplifiedOFX(content));
    }
  } catch (error) {
    console.error("Erro ao fazer parse do OFX:", error);
  }

  return { transactions, bankName, accountNumber };
}

/**
 * Parser alternativo para arquivos OFX simplificados ou CSV-like
 */
function parseSimplifiedOFX(content: string): OFXTransaction[] {
  const transactions: OFXTransaction[] = [];
  const lines = content.split("\n");

  for (const line of lines) {
    // Tenta identificar padrões de transação
    // Formato esperado: DATA|VALOR|DESCRICAO ou similar
    if (line.includes("|") || line.includes(",")) {
      const parts = line.split(/[|,]/).map((p) => p.trim());

      if (parts.length >= 3) {
        const dateStr = parts[0];
        const amountStr = parts[1];
        const description = parts[2];

        // Validar se parece uma data
        if (/^\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}/.test(dateStr)) {
          const amount = parseFloat(amountStr.replace(/[^\d.-]/g, ""));

          if (!isNaN(amount) && amount > 0) {
            transactions.push({
              id: `ofx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              date: normalizeDateFormat(dateStr),
              amount,
              description,
              type: amount > 0 ? "credit" : "debit",
            });
          }
        }
      }
    }
  }

  return transactions;
}

/**
 * Normaliza diferentes formatos de data para YYYY-MM-DD
 */
function normalizeDateFormat(dateStr: string): string {
  // Tenta DD/MM/YYYY
  const dmy = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (dmy) {
    return `${dmy[3]}-${dmy[2]}-${dmy[1]}`;
  }

  // Tenta YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    return dateStr.substring(0, 10);
  }

  // Fallback
  return new Date().toISOString().split("T")[0];
}

/**
 * Calcula similaridade entre dois valores para matching
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().replace(/[^\w]/g, "");
  const s2 = str2.toLowerCase().replace(/[^\w]/g, "");

  if (s1 === s2) return 100;

  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  if (longer.length === 0) return 100;

  const editDistance = getEditDistance(longer, shorter);
  return ((longer.length - editDistance) / longer.length) * 100;
}

/**
 * Calcula distância de edição (Levenshtein)
 */
function getEditDistance(s1: string, s2: string): number {
  const costs = [];

  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }

  return costs[s2.length];
}
