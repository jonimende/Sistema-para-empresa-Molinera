import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables, ChartConfiguration, ChartData, ChartType } from 'chart.js';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

// Registramos todos los elementos de Chart.js globalmente (necesario en v3+)
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-gerencial',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="max-w-7xl mx-auto p-4 md:p-8">
      
      <!-- HEADER CON BOTÓN IA -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-200 pb-5">
        <div>
          <h2 class="text-3xl font-bold text-slate-800">Panel Gerencial y Analítica</h2>
          <p class="text-slate-500 mt-1 font-medium">Supervisión estratégica: Producción, Logística y Calidad.</p>
        </div>
        <button type="button" (click)="$event.preventDefault(); undefined"  [disabled]="generandoIA"
                class="mt-6 md:mt-0 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center disabled:opacity-70 disabled:cursor-wait">
          <svg *ngIf="generandoIA" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <svg *ngIf="!generandoIA" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          {{ generandoIA ? 'Sintetizando IA y Despachando...' : 'Generar y Enviar Reporte IA' }}
        </button>
      </div>

      <!-- KPI CARDS (4 Tarjetas) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        <!-- Producción -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col relative overflow-hidden group">
          <div class="absolute -right-4 -top-4 w-16 h-16 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
          <div class="relative z-10 flex items-center justify-between mb-4">
            <h3 class="text-slate-500 text-xs font-bold uppercase tracking-wider">Producción (Mes)</h3>
            <span class="p-2 bg-blue-100 text-blue-600 rounded-lg"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg></span>
          </div>
          <p class="relative z-10 text-3xl font-black text-slate-800">{{ kpis.produccion_total | number }} <span class="text-sm font-medium text-slate-400">Kg</span></p>
        </div>

        <!-- NC Abiertas -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col relative overflow-hidden group">
          <div class="absolute -right-4 -top-4 w-16 h-16 bg-yellow-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
          <div class="relative z-10 flex items-center justify-between mb-4">
            <h3 class="text-slate-500 text-xs font-bold uppercase tracking-wider">NC Abiertas</h3>
            <span class="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></span>
          </div>
          <p class="relative z-10 text-3xl font-black text-slate-800">{{ kpis.nc_abiertas }}</p>
        </div>

        <!-- NC Críticas -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col relative overflow-hidden group">
          <div class="absolute -right-4 -top-4 w-16 h-16 bg-red-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
          <div class="relative z-10 flex items-center justify-between mb-4">
            <h3 class="text-slate-500 text-xs font-bold uppercase tracking-wider">Eventos Críticos</h3>
            <span class="p-2 bg-red-100 text-red-600 rounded-lg"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"></path></svg></span>
          </div>
          <p class="relative z-10 text-3xl font-black" [ngClass]="kpis.nc_criticas > 0 ? 'text-red-600' : 'text-slate-800'">{{ kpis.nc_criticas }}</p>
        </div>

        <!-- Combustible -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col relative overflow-hidden group">
          <div class="absolute -right-4 -top-4 w-16 h-16 bg-green-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
          <div class="relative z-10 flex items-center justify-between mb-4">
            <h3 class="text-slate-500 text-xs font-bold uppercase tracking-wider">Combustible Flota</h3>
            <span class="p-2 bg-green-100 text-green-600 rounded-lg"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></span>
          </div>
          <p class="relative z-10 text-3xl font-black text-slate-800">{{ kpis.litros_combustible | number }} <span class="text-sm font-medium text-slate-400">Lts</span></p>
        </div>

      </div>

      <!-- CHARTS -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Bar Chart: Producción Semanal -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 class="text-lg font-bold text-slate-700 mb-6 flex items-center">
             <div class="w-2 h-6 bg-indigo-500 rounded-full mr-3"></div>
             Producción Mensual (Estimado Semanal)
          </h3>
          <div class="h-64">
            <canvas baseChart *ngIf="barChartData"
                    [data]="barChartData" 
                    [options]="barChartOptions" 
                    [type]="'bar'">
            </canvas>
          </div>
        </div>

        <!-- Doughnut Chart: Estados de NC -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 class="text-lg font-bold text-slate-700 mb-6 flex items-center">
             <div class="w-2 h-6 bg-purple-500 rounded-full mr-3"></div>
             Estados de Fallas de Calidad
          </h3>
          <div class="h-64 flex justify-center">
            <canvas baseChart *ngIf="pieChartData"
                    [data]="pieChartData" 
                    [options]="pieChartOptions" 
                    [type]="'doughnut'">
            </canvas>
          </div>
        </div>

      </div>
    </div>
  `
})
export class DashboardGerencialComponent implements OnInit {
  private http = inject(HttpClient);

  // Estados de interfaz
  generandoIA = false;
  kpis = { produccion_total: 0, litros_combustible: 0, nc_abiertas: 0, nc_criticas: 0 };

  // --- CHART OPTIONS & DATA ---
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };
  public barChartData!: ChartData<'bar'>;

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'right' } }
  };
  public pieChartData!: ChartData<'doughnut'>;

  ngOnInit() {
    this.cargarKpis();
  }

  cargarKpis() {
    this.http.get<any>(`${environment.apiUrl}/analytics/kpis`).subscribe({
      next: (data) => {
        this.kpis = data;

        // Armamos un dummy data semanal para el BarChart en base a la producción total
        const prodBase = data.produccion_total > 0 ? (data.produccion_total / 4) : 1000;
        this.barChartData = {
          labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
          datasets: [
            { 
              data: [prodBase * 0.9, prodBase * 1.1, prodBase * 0.8, prodBase * 1.2], 
              label: 'Kilos (Kg)', 
              backgroundColor: '#4f46e5',
              borderRadius: 4
            }
          ]
        };

        // Pie Chart con los estados de las NC reales ('Pendiente', 'En Tratamiento', 'Cerrada')
        this.pieChartData = {
          labels: ['Pendiente', 'En Tratamiento', 'Cerrada'],
          datasets: [
            {
              data: data.nc_estados || [0, 0, 0],
              backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
              borderWidth: 0
            }
          ]
        };
      },
      error: (err) => console.error('Error al cargar KPIs', err)
    });
  }

  generarReporteIA() {
    this.generandoIA = true;
    this.http.post(`${environment.apiUrl}/analytics/reporte-ia`, { kpis: this.kpis }).subscribe({
      next: (res: any) => {
        Swal.fire('Procesado', res.message + ' Revisa la consola del backend para ver el link seguro de Ethereal Mail.', 'success');
        this.generandoIA = false;
      },
      error: (err) => {
        Swal.fire('Error', 'Error ejecutando el agente IA. Comprueba si el servidor tiene acceso a la red de mailer.', 'error');
        console.error(err);
        this.generandoIA = false;
      }
    });
  }

  verDetalle(item: any) {
    let html = '<div class="text-left text-sm" style="max-height: 400px; overflow-y: auto;">';
    for (let key in item) {
      if (key === "firma_inspector" || key === "firma_chofer") {
        if (item[key]) {
          html += '<p><strong>' + key + ':</strong><br><img src="' + item[key] + '" class="w-full max-w-xs border rounded mt-1"></p>';
        }
      } else {
        html += '<p><strong>' + key + ':</strong> ' + item[key] + '</p>';
      }
    }
    html += '</div>';

    Swal.fire({
      title: "Detalle del Registro",
      html: html,
      width: "600px",
      showCloseButton: true,
      showConfirmButton: false
    });
  }
}
