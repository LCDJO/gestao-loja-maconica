import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ScrollText, Landmark, Calendar, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative rounded-xl overflow-hidden shadow-2xl border border-border/50 group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40 z-10 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[url('/images/hero-dashboard.jpg')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" />
          
          <div className="relative z-20 p-8 md:p-12 text-white">
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4 tracking-tight drop-shadow-md">
              Bem-vindo, Venerável Mestre
            </h1>
            <p className="font-serif text-lg md:text-xl text-white/90 max-w-2xl italic mb-8 leading-relaxed">
              "A sabedoria constrói a casa, e a inteligência a firma."
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/secretaria">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold shadow-lg border border-white/10">
                  Acessar Secretaria
                </Button>
              </Link>
              <Link href="/tesouraria">
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm">
                  Ver Tesouraria
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-blue-600 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground font-sans uppercase tracking-wider">
                Total de Membros
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display text-primary">42</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <span className="text-green-600 font-medium flex items-center mr-1">
                  <TrendingUp className="h-3 w-3 mr-0.5" /> +2
                </span>
                este mês
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground font-sans uppercase tracking-wider">
                Tronco de Beneficência
              </CardTitle>
              <Landmark className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display text-primary">R$ 1.250,00</div>
              <p className="text-xs text-muted-foreground mt-1">
                Última sessão: R$ 320,00
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-600 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground font-sans uppercase tracking-wider">
                Próxima Reunião
              </CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-display text-primary truncate">15/06/2024</div>
              <p className="text-xs text-muted-foreground mt-1">
                Sessão Magna de Iniciação
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Modules Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Secretaria */}
          <Link href="/secretaria">
            <Card className="h-full hover:border-primary/50 transition-all cursor-pointer group overflow-hidden">
              <div className="h-32 bg-[url('/images/secretariat-banner.jpg')] bg-cover bg-center relative">
                <div className="absolute inset-0 bg-primary/60 group-hover:bg-primary/50 transition-colors" />
                <div className="absolute bottom-4 left-4 text-white flex items-center gap-2">
                  <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                    <ScrollText className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-bold text-xl">Secretaria</h3>
                </div>
              </div>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  Gestão completa de membros, atas de reuniões e registros históricos da loja.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="text-sm flex items-center text-foreground/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                    Cadastro de Irmãos
                  </li>
                  <li className="text-sm flex items-center text-foreground/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                    Atas e Documentos
                  </li>
                  <li className="text-sm flex items-center text-foreground/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                    Tronco de Beneficência
                  </li>
                </ul>
                <Button variant="ghost" className="w-full justify-between group-hover:text-primary group-hover:bg-primary/5">
                  Acessar Módulo <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Chancelaria */}
          <Link href="/chancelaria">
            <Card className="h-full hover:border-primary/50 transition-all cursor-pointer group overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-slate-700 to-slate-900 relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')] opacity-20" />
                <div className="absolute bottom-4 left-4 text-white flex items-center gap-2">
                  <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-bold text-xl">Chancelaria</h3>
                </div>
              </div>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  Controle de presença, registro de visitantes e estatísticas de frequência.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="text-sm flex items-center text-foreground/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-2" />
                    Livro de Presença
                  </li>
                  <li className="text-sm flex items-center text-foreground/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-2" />
                    Registro de Visitantes
                  </li>
                  <li className="text-sm flex items-center text-foreground/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-2" />
                    Estatísticas de Frequência
                  </li>
                </ul>
                <Button variant="ghost" className="w-full justify-between group-hover:text-primary group-hover:bg-primary/5">
                  Acessar Módulo <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Tesouraria */}
          <Link href="/tesouraria">
            <Card className="h-full hover:border-primary/50 transition-all cursor-pointer group overflow-hidden">
              <div className="h-32 bg-[url('/images/treasury-banner.jpg')] bg-cover bg-center relative">
                <div className="absolute inset-0 bg-amber-900/60 group-hover:bg-amber-900/50 transition-colors" />
                <div className="absolute bottom-4 left-4 text-white flex items-center gap-2">
                  <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                    <Landmark className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-bold text-xl">Tesouraria</h3>
                </div>
              </div>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  Gestão financeira completa, controle de mensalidades, receitas e despesas.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="text-sm flex items-center text-foreground/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mr-2" />
                    Fluxo de Caixa
                  </li>
                  <li className="text-sm flex items-center text-foreground/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mr-2" />
                    Controle de Mensalidades
                  </li>
                  <li className="text-sm flex items-center text-foreground/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mr-2" />
                    Relatórios Financeiros
                  </li>
                </ul>
                <Button variant="ghost" className="w-full justify-between group-hover:text-primary group-hover:bg-primary/5">
                  Acessar Módulo <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
