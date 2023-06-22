/**
 * The configuration for job(s) to run on release.
 * If an object is provided the key is used as branch name,
 * otherwise the job is run on all branches.
 */
export type JobConfiguration = JobBranchConfiguration | { [branch: string]: JobBranchConfiguration };

/**
 * The job branch configuration.
 * If a string or string array is provided, the job is run without parameters,
 * otherwise parameters can be provided for each job.
 */
export type JobBranchConfiguration = string | string[] | JobConfigurationOptions | JobConfigurationOptions[];

/**
 * The job configuration options.
 */
export interface JobConfigurationOptions {
    /** The jobs id or name */
    id: string;
    /** The parameters used when starting the job. */
    parameters?: { [key: string]: string };
}
