require('dotenv').config({path: __dirname + '/.env'})

const http = require('http');
var options = {
  host: 'works.wtf',
  path: process.env['api.content.basePathUrl']
};

var requestify = require('requestify');


const baseContentApiUrl = process.env['api.content.basePathUrl']'

function getPublicationById(req,response,client){
	console.log("test2");
	const id = req.params.id;
	console.log(id);
	const publicationSelectionQuery = {
		text: 'SELECT * FROM "publication"."publications" where "publication"."publications"."id" = $1',
		values: [id]
	}
	client.query(publicationSelectionQuery, (err, res) => {
		if (err) {
			console.log(err.stack);
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
					message : 'The publication '+id+' doesn\'t exist in db'
				});
			}else{
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
	const username = req.query.username;
	const publicationsSelectionQuery = {
		text: 'SELECT * FROM "publication"."publications" where "publication"."publications".username = $1',
		values: [username]
	}
	client.query(publicationsSelectionQuery, (err, res) => {
	if (err) {
		console.log(err.stack);
		response.send({
			success: false,
			code: 400,
			message: 'Error while getting the publications of the user '+username
		});
		} else {
			const jsonObject={};
			const key = 'publications';
			const rows = res.rows;
			jsonObject[key] = [];
			for (var i = 0; i < rows.length; i++) {
				const id=rows[i].id;
				const description=rows[i].description;
				const username=rows[i].username;
				const creation_date=rows[i].creation_date;
				const contentId;
				if(row[i].content_id)=='0'{
					contentId='5f5e6386-997b-4fdd-bb22-b57a5f7a755f';
				}else{
					contentId=row[i].content_id;
				}
				requestify.get(baseContentApiUrl+'/'+contentId).then(function(response) {
					var publication={
						"id":id,
						"description" :description,
						"username":username,
						"creation_date":creation_date,
						"content":{
							"data":response.getBody().data
						}
					};
					jsonObject[key].push(publication);
				},
				response.send({
					success: true,
					code: 200,
					data :jsonObject
				});
			}
			
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
			console.log(err.stack);
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
					console.log(err.stack);
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
			console.log(err.stack);
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
	getPublicationsByUsername,
	deletePublicationById,
	createPublication
}