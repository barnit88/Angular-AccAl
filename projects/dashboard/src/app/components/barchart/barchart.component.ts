import { Component, ViewChild, OnInit, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, NgChartsModule, FormsModule],
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.scss'],
})
export class BarchartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  // Mocked backend response
  private mockedResponse = {
    data: [
      {
        integration: 'Slack',
        activeUsers: [30, 50, 80, 40, 50, 30, 20],
      },
      {
        integration: 'GCP',
        activeUsers: [40, 90, 80, 20, 50, 60, 20],
      },
      {
        integration: 'Airtable',
        activeUsers: [80, 20, 50, 70, 30, 90, 20],
      },
    ],
  };

  public data: any[] = this.mockedResponse.data;
  public selectedIntegration = '';

  onIntegrationChange(): void {
    this.updateChartData();
  }

  ngOnInit(): void {
    if (this.data.length > 0) {
      this.selectedIntegration = this.data[0].integration;
      this.updateChartData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.updateChartData();
    }
  }

  // ... (rest of the code remains the same, no changes)
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    layout: {
      padding: {
        top: 60,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          padding: 20, // Increase distance between labels and bars
        },
        border: {
          color: 'transparent', // Set border color to transparent
        },
      },
      y: {
        min: 10,
        grid: {
          display: false,
        },
        ticks: {
          padding: 20, // Increase distance between labels and bars
        },
        border: {
          color: 'transparent', // Set border color to transparent
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    elements: {
      bar: {
        borderRadius: 5,
      },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [];

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Active',
        backgroundColor: context => {
          const chart = context.chart;
          const ctx = chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
          gradient.addColorStop(0, 'rgba(35, 0, 80, 1)');
          gradient.addColorStop(0.4, 'rgba(35, 0, 80, 1)');
          gradient.addColorStop(1, 'rgba(75, 0, 130, 0.5)');
          return gradient;
        },
        borderColor: 'rgba(75, 0, 130, 1)',
        borderWidth: 1,
        barPercentage: 0.5,
        barThickness: (100 * 1.5) / 15,
      },
    ],
  };

  //Intentionally  commented for now
  public chartClicked(_event: object): void {
    // alert('Clicked');
  }

  public chartHovered(_event: object): void {
    // alert('Hovered');
  }

  private getLastWeekdays(today: Date): string[] {
    const weekdays: string[] = [];
    let count = 0;
    while (weekdays.length < 7) {
      const day = new Date(today.getTime() - count * 24 * 60 * 60 * 1000);
      if (day.getDay() !== 0 && day.getDay() !== 6) {
        // Skip weekends (Sunday = 0, Saturday = 6)
        const dateString = `${day.toLocaleString('en-us', { weekday: 'short' })} - ${
          day.getMonth() + 1
        }/${day.getDate()}`;
        weekdays.unshift(dateString);
      }
      count++;
    }
    return weekdays;
  }

  updateChartData(): void {
    const today = new Date();
    this.barChartData.labels = this.getLastWeekdays(today);

    const activeUsers = this.data.find(
      integrationData => integrationData.integration === this.selectedIntegration,
    )?.activeUsers;

    if (activeUsers) {
      this.barChartData.datasets[0].data = activeUsers;
    }

    this.chart?.update();
  }
}
