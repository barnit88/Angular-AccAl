import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartData, ChartType, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, NgChartsModule, HttpClientModule],
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.scss'],
})
export class PiechartComponent implements OnInit {
  constructor(private http: HttpClient) {}

  public doughnutChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          boxWidth: 10,
          pointStyle: 'circle',
          borderRadius: 100,
          useBorderRadius: false,
        },
        position: 'left',
        align: 'start',
      },
      tooltip: {
        callbacks: {
          title: (context: any[]) => {
            const firstContext = context[0];
            const labelIndex = firstContext.datasetIndex;
            const label = this.doughnutChartLabels[labelIndex];
            return label;
          },
          label: (context: any) => {
            const value = context.formattedValue;
            return `Value: ${value}`;
          },
        },
      },
    },
  };

  public doughnutChartLabels: string[] = [];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [],
  };
  public doughnutChartType: ChartType = 'doughnut';

  //Intentionally  commented for now
  // public chartClicked(): void {
  // }

  // public chartHovered(): void {
  // }

  ngOnInit() {
    this.fetchActiveUsersData();
  }

  private fetchActiveUsersData(): void {
    const mockedResponse = of([{ gcp: 33, slack: 67, airtable: 76, quickbook: 34 }]);

    mockedResponse
      .pipe(
        map((response: any[]) => response[0]),
        map((data: Record<string, number>) => {
          const sortedData = Object.entries(data).sort((a, b) => b[1] - a[1]);
          const labels = sortedData.map(item => item[0]);
          const values = sortedData.map(item => item[1]);
          return { labels, values };
        }),
      )
      .subscribe(({ labels, values }) => {
        this.doughnutChartLabels = labels;

        // Sort the data in descending order
        const sortedData = this.doughnutChartLabels
          .map((label, index) => ({ label, value: values[index] }))
          .sort((a, b) => b.value - a.value);

        const datasets = sortedData.map((data, index) => {
          const baseColor = index % 2 === 0 ? 'rgba(75, 17, 97, 1)' : 'rgba(95, 59, 141, 1)'; // Dark purple and light purple colors

          return {
            data: [data.value, 0.1],
            backgroundColor: [baseColor, 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)'], // Use baseColor for the circle, transparent color for spacing
            borderWidth: 5,
            borderColor: 'rgba(255, 255, 255, 1)',
            weight: sortedData.length,
            borderAlign: 'inner' as const,
          };
        });

        this.doughnutChartData = {
          labels: sortedData.map(data => data.label),
          datasets,
        };
      });
  }
}
