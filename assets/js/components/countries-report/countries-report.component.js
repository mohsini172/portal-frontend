angular.
	module('app').
	component('countriesReport', {
		bindings: { subtype: '<' },
		templateUrl: base_href + "/assets/js/components/countries-report/countries-report.component.html",
		controller: function GreetUserController(ReportService) {
			this.isloading = false;
			this.table = jQuery('#countries-reports-table').DataTable({
				paging: false,
				info: false,
				lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]],
				searching: false,
				order: [[2, "desc"]],
				oLanguage: {
					sLengthMenu: ""
				}
			});
			this.$onChanges = (changeObject) => {
				if (+changeObject.subtype.currentValue != changeObject.subtype.previousValue) {
					this.isloading = true;
					ReportService.list("countries", changeObject.subtype.currentValue)
						.then((res) => {
							this.table.clear();
							let totals = ["Total", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
							for (let row in res.data) {
								this.table.row.add([
									res.data[row].name,
									res.data[row].totalUsers,
									res.data[row].totalSubscribed,
									res.data[row].totalUnsubscribed,
									res.data[row].subscribed,
									ReportService.roundTo(res.data[row].gain, 4),
									res.data[row].unsubscribed,
									ReportService.roundTo(res.data[row].loss, 4),
									ReportService.roundTo(res.data[row].growth, 4),
									ReportService.roundTo(res.data[row].growthPercent, 4),
									res.data[row].totalClicks,
									ReportService.roundTo(res.data[row].openRate, 4),
								])
								totals[0] += res.data[row].name;
								totals[1] += res.data[row].totalUsers;
								totals[2] += res.data[row].totalSubscribed;
								totals[3] += res.data[row].totalUnsubscribed;
								totals[4] += res.data[row].subscribed;
								totals[5] += parseFloat(res.data[row].gain);
								totals[6] += res.data[row].unsubscribed;
								totals[7] += parseFloat(res.data[row].loss);
								totals[8] += parseFloat(res.data[row].growth);
								totals[9] += parseFloat(res.data[row].growthPercent);
								totals[10] += res.data[row].totalClicks;
								totals[11] += parseFloat(res.data[row].openRate);
							}
							this.table.column(1).footer().innerHTML = totals[1];
							this.table.column(2).footer().innerHTML = totals[2];
							this.table.column(3).footer().innerHTML = totals[3];
							this.table.column(4).footer().innerHTML = totals[4];
							this.table.column(5).footer().innerHTML = ReportService.roundTo(totals[5]);
							this.table.column(6).footer().innerHTML = totals[6];
							this.table.column(7).footer().innerHTML = ReportService.roundTo(totals[7]);
							this.table.column(8).footer().innerHTML = ReportService.roundTo(totals[8]);
							this.table.column(9).footer().innerHTML = ReportService.roundTo(totals[9]);
							this.table.column(10).footer().innerHTML = totals[10];
							this.table.column(11).footer().innerHTML = ReportService.roundTo(totals[11]);
							this.table.draw();
							this.isloading = false;
						})
						.catch((error) => {
							this.isloading = false;
							console.error(error);
						})
				}
			}
		}
	});