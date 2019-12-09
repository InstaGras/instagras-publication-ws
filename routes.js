function getPublicationById(req,response,client){
	const id = req.params.id;
	const publicationSelectionQuery = {
		text: 'SELECT * FROM "publication"."publications" where "publication"."publications"."id" = $1',
		values: [id]
	}
	client.query(publicationSelectionQuery, (err, res) => {
		if (err) {
			response.send({
				success: false,
				code: 400,
				message: 'Error while getting the publication '+id+' in db.'
			});
		} else {
			const rows = res.rows;
			if(rows[0] == undefined){
				response.send({
					success: false,
					code: 400,
					message : rows
					
				});
			} else {
				const publication={
					"id":rows[0].id,
					"description" :rows[0].description,
					"username":rows[0].username,
					"creation_date":rows[0].creation_date,
					"content_id":rows[0].content_id,
				};
				response.send({
					success: true,
					code: 200,
					data : publication
				});
			}
		}
	});
}

function getPublicationsByUsername(req,response,client){
	const username = req.params.username;
	const publicationsSelectionQuery = {
		text: 'SELECT * FROM "publication"."publications" where user"."followers".followed_username = $1',
		values: [username]
	}
	client.query(publicationsSelectionQuery, (err, res) => {
	if (err) {
		response.send({
			success: false,
			code: 400,
			message: 'Error while getting the publications\' list of the user '+username
		});
		} else {
			const jsonObject={};
			const key = 'publications';
			const rows = res.rows;
			jsonObject[key] = [];
			for (var i = 0; i < rows.length; i++) { 
				var publication={
					"id":rows[0].id,
					"description" :rows[0].description,
					"username":rows[0].username,
					"creation_date":rows[0].creation_date,
					"content_id":rows[0].content_id
				};
				jsonObject[key].push(publication);
			}
			response.send({
				success: true,
				code: 200,
				data :jsonObject
			});
		}
	})
}


function createPublication(req,response,client){
	const username = req.body.username;
	const description = req.body.description;
	const creation_date = getCurrentDate();
	const content_id = 0;
	const UIDGenerator = require('uid-generator');
	const uidgen = new UIDGenerator();
	uidgen.generate((err, uid) => {
		if (err){
			response.send({
				success: false,
				code: 400,
				message: "Error during generation of publication's uid"
			});
		} 
		else{
			const id=uid;
			const publicationInsertionQuery = {
				text: 'INSERT INTO "publication".publications(id,description,username,creation_date,content_id) values ($1,$2,$3,$4,$5)',
				values: [id,description,username,creation_date,content_id]
			}
			client.query(publicationInsertionQuery, (err, res) => {
				if (err) {
					response.send({
						success: false,
						code: 400,
						message: "Error during publication creation : "+creation_date 
					});
				} else {
					response.send({
						success: true,
						code: 200,
						message: 'The publication has been created',
					});
				}
			})
		}
	  });	
};

function deletePublicationById(req,response,client){
	const publicationId = req.body.id_publication;
	const publicationDeletionQuery = {
		text: 'DELETE from "publication"."publications" where "publication"."publications"."id" = $1',
		values: [publicationId]
	}
	client.query(publicationDeletionQuery, (err, res) => {
		if (err) {
			response.send({
				success: false,
				code: 400,
				message: "Error during publication deletion."
			});
		} else {
			response.send({
				success: true,
				code: 200,
				message: 'The publication has been deleted',
			});
		}
	})
};

function getCurrentDate(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1; //January is 0!
	var yyyy = today.getFullYear();
	if (dd < 10) {
 		 dd = '0' + dd;
	} 
	if (mm < 10) {
 		 mm = '0' + mm;
	} 
	var today = dd + '/' + mm + '/' + yyyy;
	return today;
}

module.exports = {
	getPublicationById,
	deletePublicationById,
	createPublication
}