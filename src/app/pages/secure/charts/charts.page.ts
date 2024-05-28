import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { HelperService } from 'src/app/services/helper/helper.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.page.html',
  styleUrls: ['./charts.page.scss'],
})
export class ChartsPage implements OnInit {

  materiasPrimas: { nombre: string, costo: number }[] = [{ nombre: '', costo: 0 }];
  otrosGastos: { nombre: string, gasto: number }[] = [{ nombre: '', gasto: 0 }];
  margenBeneficio: number = 0;
  impuestos: number = 0;
  costoProduccion: number | null = null;
  costoFabrica: number | null = null;
  costoDistribucion: number | null = null;
  pvp: number | null = null;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.4
      }
    },
    animation: {
      easing: 'easeInOutElastic',
      delay: 25
    },
    responsive: true,
    scales: {
      x: {
        grid: {
          color: '#ccc' // Ajuste de color del grid
        },
        ticks: {
          color: '#666',
          font: {
            family: 'Inter',
            weight: '500'
          }
        }
      },
      y: {
        position: 'right',
        grid: {
          color: '#ccc'
        },
        ticks: {
          color: '#666',
          callback: function (value) {
            return '$' + value;
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#333',
        bodyColor: '#666',
        titleColor: '#fff',
        titleFont: {
          size: 14,
          weight: 'normal'
        },
        bodyFont: {
          size: 16,
          weight: 'bold'
        },
        padding: 12,
        boxWidth: 10,
        boxHeight: 10,
        boxPadding: 3,
        usePointStyle: true,
        callbacks: {
          label: function (context) {
            var label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    }
  };

  public barChartLabels: string[] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    ]
  };

  public polarAreaChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales'];
  public polarAreaChartData: ChartData<'polarArea'> = {
    labels: this.polarAreaChartLabels,
    datasets: [{
      data: [300, 500, 100, 40, 120],
      label: 'Series 1'
    }]
  };
  public polarAreaLegend = true;
  public polarAreaChartType: ChartType = 'polarArea';

  content_loaded: boolean = false;

  constructor(private helperService: HelperService) { }

  ngOnInit() {
    this.createBarChart();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.content_loaded = true;
    }, 2000);
  }

  agregarMateriaPrima() {
    this.materiasPrimas.push({ nombre: '', costo: 0 });
  }

  agregarOtrosGastos() {
    this.otrosGastos.push({ nombre: '', gasto: 0 });
  }

  ngDoCheck() {
    this.calcularCostos();
  }

  calcularCostos() {
    const costoMateriasPrimas = this.materiasPrimas.reduce((total, materia) => total + (materia.costo || 0), 0);
    const totalOtrosGastos = this.otrosGastos.reduce((total, gasto) => total + (gasto.gasto || 0), 0);
    this.costoProduccion = costoMateriasPrimas + totalOtrosGastos;

    // Suponiendo que el costo de fábrica es un 20% del costo de producción
    this.costoFabrica = this.costoProduccion * 0.20;

    // Suponiendo que el costo de distribución es un 10% del costo de producción
    this.costoDistribucion = this.costoProduccion * 0.10;

    const costoTotal = this.costoProduccion + this.costoFabrica + this.costoDistribucion;
    const beneficio = costoTotal * (this.margenBeneficio / 100);
    const impuestosCalculados = (costoTotal + beneficio) * (this.impuestos / 100);
    this.pvp = costoTotal + beneficio + impuestosCalculados;
  }

  createBarChart() {
    let helperService = this.helperService;
    let rand_numbers = [...Array(12)].map(e => Math.random() * 100 | 0);

    this.barChartData.labels = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    this.barChartData.datasets = [
      {
        data: rand_numbers,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return null;
          }

          return helperService.createGradientChart(ctx, 'tertiary', 'tertiary');
        },
        barThickness: 10,
        borderRadius: 4,
        borderColor: helperService.getColorVariable('secondary'),
        hoverBackgroundColor: helperService.getColorVariable('secondary'),
        pointStyle: 'circle',
      }
    ];
  }
}
