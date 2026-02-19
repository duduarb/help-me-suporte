export default function handler(req, res) {
  // O valor da senha não fica aqui, ele fica no cofre da Vercel
  const SENHA_MESTRA = process.env.ADMIN_PASSWORD;

  if (req.method === 'POST') {
    const { senhaDigitada } = req.body;

    if (senhaDigitada === SENHA_MESTRA) {
      return res.status(200).json({ autorizado: true });
    }
    return res.status(401).json({ autorizado: false });
  }
  return res.status(405).json({ message: "Método não permitido" });
}