import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

//Enable Cloud Run
const enableCloudRun = new gcp.projects.Service("EnableCloudRun", {
    service: "run.googleapis.com",
});

const location = gcp.config.region || "europe-west3";

const helloService = new gcp.cloudrun.Service("hello", {
	location,
	template: {
		spec: {
			containers: [
				{ image: "gcr.io/cloudrun/hello" }
			]
		}
	}
}, { dependsOn: enableCloudRun });


const iamHello = new gcp.cloudrun.IamMember("hello-everyone", {
	service: helloService.name,
	location,
	role: "roles/run.invoker",
	member: "allUsers"
});

export const helloUrl = helloService.statuses.apply(v=>v[0].url);

//export const helloUrl = helloService.statuses.url;
