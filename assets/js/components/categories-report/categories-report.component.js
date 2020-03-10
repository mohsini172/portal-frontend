angular.
	module('app').
	component('categoriesReport', {
		bindings: { subtype: '<' },
		templateUrl: base_href + "/assets/js/components/categories-report/categories-report.component.html",
		controller: function GreetUserController(ReportService) {
			this.isloading = false;
			this.table = jQuery('#categories-report-table').DataTable({
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
				console.log(this.table.columns().header())
				console.log(this.table.row(0).data())
				if (+changeObject.subtype.currentValue != changeObject.subtype.previousValue) {
					this.isloading = true;
					ReportService.list("categories", changeObject.subtype.currentValue)
						.then((res) => {
							this.table.clear();
							let totals = ["Total", 0, 0, 0, 0, 0, 0, 0]
							for (let row in res.data) {
								this.table.row.add([
									res.data[row].name,
									res.data[row].totalUsers,
									res.data[row].totalSubscribed,
									res.data[row].unsubscribed,
									ReportService.roundTo(res.data[row].loss, 4),
									res.data[row].totalClicks,
									0
								])
								totals[1] += res.data[row].totalUsers;
								totals[2] += res.data[row].totalSubscribed;
								totals[3] += res.data[row].unsubscribed;
								totals[4] += parseFloat(res.data[row].loss, 4);
								totals[5] += res.data[row].totalClicks;
								totals[6] += 0;
							}
							this.table.column(1).footer().innerHTML = totals[1];
							this.table.column(2).footer().innerHTML = totals[2];
							this.table.column(3).footer().innerHTML = totals[3];
							this.table.column(4).footer().innerHTML = ReportService.roundTo(totals[4]);
							this.table.column(5).footer().innerHTML = totals[5];
							this.table.column(6).footer().innerHTML = totals[6];
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