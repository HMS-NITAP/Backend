const freezeLetter = (remarks) => {
	return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8">
		<title>Regarding Hostel Allottment</title>
		<style>
			body {
				background-color: #ffffff;
				font-family: Arial, sans-serif;
				font-size: 16px;
				line-height: 1.4;
				color: #333333;
				margin: 0;
				padding: 0;
			}
	
			.container {
				max-width: 600px;
				margin: 0 auto;
				padding: 20px;
				text-align: center;
			}
	
			.logo {
				max-width: 200px;
				margin-bottom: 20px;
			}
	
			.message {
				font-size: 18px;
				font-weight: bold;
				margin-bottom: 20px;
			}
	
			.body {
				font-size: 16px;
				margin-bottom: 20px;
			}
	
			.cta {
				display: inline-block;
				padding: 10px 20px;
				background-color: #FFD60A;
				color: #000000;
				text-decoration: none;
				border-radius: 5px;
				font-size: 16px;
				font-weight: bold;
				margin-top: 20px;
			}
	
			.support {
				font-size: 14px;
				color: #999999;
				margin-top: 20px;
			}
	
			.highlight {
				font-weight: bold;
			}
		</style>
	
	</head>
	
	<body>
		<div class="container">
			<a href="https://www.nitandhra.ac.in/main/"><img class="logo"
					src="https://res.cloudinary.com/dwt1vmf2u/image/upload/v1720685383/logo_jfjskg.png" alt="NITAP Logo"></a>
			<div class="message">Hostel Allottment Application Freezed</div>
			<div class="body">
				<p>Dear Student,</p>
				<p>Your hostel registration and room allotment process have been temporarily suspended on disciplinary grounds.</p>
                <p class="highlight">Reason: ${remarks}</p>
                <p>However, your hostel room will be blocked in the meantime, ensuring no other student can register for the same room and cot. To complete your registration and get your chosen room allotted, you must visit the Hostel Office in person.</p>
			</div>
			<div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a
					href="mailto:hmsnitap@gmail.com">hmsnitap@gmail.com</a>. We are here to help!</div>
		</div>
	</body>
	
	</html>`;
};

module.exports = freezeLetter