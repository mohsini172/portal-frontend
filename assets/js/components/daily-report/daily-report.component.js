angular.
	module('app').
	component('dailyReport', {
		bindings: { subtype: '<' },
		templateUrl: base_href + "/assets/js/components/daily-report/daily-report.component.html",
		controller: function GreetUserController(ReportService) {
			this.isloading = false;
			this.table = jQuery('#daily-report-table').DataTable({
				paging: false,
				info: false,
				lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]],
				searching: false,
				order: [[0, "desc"]],
				oLanguage: {
					sLengthMenu: ""
				}
			});
			this.$onChanges = (changeObject) => {
				if (+changeObject.subtype.currentValue != changeObject.subtype.previousValue) {
					this.isloading = true;
					ReportService.list("daily", changeObject.subtype.currentValue)
						.then((res) => {
							this.table.clear();
							let totals = ["Total", 0, 0, 0, 0, 0, 0, 0]
							for (let row in res.data) {
								this.table.row.add([
									res.data[row].name,
									res.data[row].totalUsers,
									res.data[row].subscribed,
									ReportService.roundTo(res.data[row].gain, 4),
									res.data[row].unsubscribed,
									ReportService.roundTo(res.data[row].loss, 4),
									ReportService.roundTo(res.data[row].growth, 4),
									res.data[row].totalClicks
								])
								totals[1] += res.data[row].totalUsers;
								totals[2] += res.data[row].subscribed;
								totals[3] += parseFloat(res.data[row].gain);
								totals[4] += res.data[row].unsubscribed;
								totals[5] += parseFloat(res.data[row].loss);
								totals[6] += parseFloat(res.data[row].growth);
								totals[7] += parseInt(res.data[row].totalClicks);
							}
							this.table.column(1).footer().innerHTML = totals[1];
							this.table.column(2).footer().innerHTML = totals[2];
							this.table.column(3).footer().innerHTML = ReportService.roundTo(totals[3]);
							this.table.column(4).footer().innerHTML = totals[4];
							this.table.column(5).footer().innerHTML = ReportService.roundTo(totals[5]);
							this.table.column(6).footer().innerHTML = ReportService.roundTo(totals[6]);
							this.table.column(7).footer().innerHTML = totals[7];
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