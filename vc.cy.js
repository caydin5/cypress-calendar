var today = new Date();
var targetDate = new Date("03/09/2024");
var longMonth = (today.getMonth() + 1) % 2 == 0;

// To calculate the # of days between two dates
var days = parseInt((targetDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

describe("vc", () => {

	// Function to get the text of the active date
	const getActiveDateText = () => {
		const activeDate = cy.get("tr > td.day.active").invoke("text");
		return activeDate
	};

	// Function to click the date with the text +1 of the active date
	const clickNextDate = () => {
		getActiveDateText().then((activeDateText) => {
      cy.get("div.datepicker-days th.datepicker-switch").invoke('text').then((month) => {
        const isLeapYear = parseInt(month.match(/\d+/g)[0], 10) % 4 == 0;
        if ((activeDateText == '30' && !longMonth) || (activeDateText == '31' && longMonth) || month.includes('February') && ((activeDateText == '28' && !isLeapYear || activeDateText == '29' && isLeapYear))) {
          !longMonth ? longMonth = true : longMonth = false;
          cy.get("tr > td.day.new")
          .contains('1')
          .click();
        }
        else {
          const nextDateText = (parseInt(activeDateText, 10) + 1).toString();
          cy.get(`tr > td.day:not(.disabled):not(.today):not(.active):not(.new):not(.old)`)
            .contains(nextDateText)
            .click();
        }
        cy.log(month);
      });
		});
	};

  it("tests vc", () => {

    // Input simulation
    cy.viewport(1208, 994);
    cy.visit("insert-link-here");
    cy.get("#city").select("6");
    cy.get("#office").select("2");
    cy.get("#totalPerson").select("1");
		cy.get("#btnAppCountNext").click();
    cy.get("#name1").type("NAME");
    cy.get("#surname1").type("LASTNAME");
    cy.get("#birthday1").select("01");
    cy.get("#birthmonth1").select("01");
    cy.get("#birthyear1").select("1995");
    cy.get("#passport1").type("ABCDEFGh");
    cy.get("#phone1").type("12345678912");
    cy.get("#email1").type("email@email.com");
    cy.get("#btnAppPersonalNext").click();
    cy.get("#btnAppPreviewNext").click();
    cy.get("#appCalendar div > div:nth-of-type(2) input").click();
    cy.get("div.datepicker-days th.next").click();
    cy.get("div.datepicker-days th.next").dblclick();
    cy.get("div.datepicker-days th.next").click();
    cy.get("tr:nth-of-type(2) > td:nth-of-type(6)").click();

    // Click the calendar input field to open the calendar
    cy.get("#tarihGoster input").click();
    // Click the first available date that is after the active date
    cy.get("tr > td.today.day")
      .click();

    // DEBUG: Start at any date in the current month
    // cy.get(`tr > td.day:not(.disabled):not(.today):not(.active):not(.new):not(.old)`)
    // .contains('30')
    //.click();

    cy.then(() => {

			var genArr = Array.from({length:days - 1},(k)=>k+1)
			cy.wrap(genArr).each(() => {
				// Click the calendar input field to open the calendar
				cy.get("#tarihGoster input").click();
				clickNextDate();

        // Assert message
				cy.get("#appCalendar div:nth-of-type(6) > div > div:nth-of-type(1) > div").should('include.text', '');
        // Give time for the text to appear
				cy.wait(1000);
				cy.get("#appCalendar div:nth-of-type(6) > div > div:nth-of-type(1) > div").should('include.text', 'Seçtiğiniz tarihte uygun randevu saati bulunmamaktadır.');
			})
		})
  });
});
//# recorderSourceMap=BCBDBEBFBGBHBIBJBKBLBMBNANANBOBPBQBRBSBTBUBVBWBXBYAYAYBZBaBbBcBdBeBfBgBBhBBiBBjBAjBB
